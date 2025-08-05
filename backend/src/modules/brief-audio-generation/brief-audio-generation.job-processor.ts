import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import {
  GenerateBriefAudioJob,
  GenerateBriefAudioProcessChunkJob,
  GenerateBriefAutioProcessChunkJobPriority,
} from './jobs/generate-brief-audio.job';
import { BriefAudioStorageRepository } from '../storage/brief-audio-storage.repository';
import path from 'path';
import { AudioGenerationService } from '../audio-generation/audio-generation.service';
import { HlsService } from '../../utils/audio/hls.service';
import { Logger } from '@nestjs/common';
import { RoundRobin } from '../../utils/data-structures/round-robin';
import { Job } from 'bullmq';
import { BriefAudioGenerationQueue } from './brief-audio-generation.queue';

@Processor(QueueName.BriefAudioGeneration)
export class BriefAudioGenerationJobProcessor extends WorkerHost {
  private readonly logger = new Logger(BriefAudioGenerationJobProcessor.name);
  // todo - may be problematic with multiple backend instances
  private readonly userRoundRobin: RoundRobin<string> = new RoundRobin<string>();

  constructor(
    private readonly briefAudioStorageRepository: BriefAudioStorageRepository,
    private readonly audioGenerationService: AudioGenerationService,
    private readonly hlsService: HlsService,
    private readonly briefAudioGenerationQueue: BriefAudioGenerationQueue,
  ) {
    super();
  }

  async process(job: GenerateBriefAudioJob | GenerateBriefAudioProcessChunkJob) {
    // Check job type based on job name pattern
    if (job.name.startsWith('generate-brief-audio-')) {
      if (job.name.includes('-process-chunk-')) {
        const processJob = job as GenerateBriefAudioProcessChunkJob;
        await this.processGenerateBriefAudioChunkJob(processJob);
      } else {
        // Parent job processing - just finalize the playlist
        const { hlsOutputDir } = this.briefAudioStorageRepository.getBriefPaths(job.data.briefId);
        this.hlsService.closePlaylistFile(hlsOutputDir);
      }
    } else {
      throw new Error('BriefAudioGenerationJobProcessor.process(): Unknown job name');
    }
  }

  private readonly processGenerateBriefAudioChunkJob = async (
    job: GenerateBriefAudioProcessChunkJob,
  ) => {
    try {
      const { userId, lastRequestAt } = job.data;
      this.userRoundRobin.addIfNotPresent(userId);
      const currentTurnUserId = this.userRoundRobin.next().value;
      if (
        lastRequestAt < Date.now() - 1000 * 8 &&
        // if it's been already rescheduled, don't reschedule again
        job.priority !== GenerateBriefAutioProcessChunkJobPriority.Abandoned
      ) {
        await this.markJobAbandoned(job);
        await this.moveJobBackToActive(job);
        return;
      }

      if (currentTurnUserId !== userId) {
        await this.moveJobBackToActive(job);
        return;
      }

      const { wavOutputDir, hlsOutputDir } = this.briefAudioStorageRepository.getBriefPaths(
        job.data.briefId,
      );
      const wavFilePath = path.join(wavOutputDir, `audio-${job.data.chunkIndex}.wav`);

      await this.audioGenerationService.generateSpeechFromText(job.data.text, wavFilePath);
      await this.hlsService.appendPlaylistFile(hlsOutputDir, wavFilePath, job.data.chunkIndex);
    } catch (e) {
      this.logger.error('GenerateBriefAudioProcessChunkJob', e);
      throw e;
    }
  };

  private readonly markJobAbandoned = async (job: Job) => {
    await job.changePriority({ priority: GenerateBriefAutioProcessChunkJobPriority.Abandoned });
    await job.changePriority({ priority: GenerateBriefAutioProcessChunkJobPriority.Abandoned });
  };

  private readonly moveJobBackToActive = async (job: Job) => {
    await job.moveToDelayed(Date.now() + 100);
    this.logger.debug(`Job ${job.name} moved to delayed.`);
  };

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    const userHasActiveJobs = await this.briefAudioGenerationQueue.checkIfUserHasActiveJobs(
      job.data.userId,
    );

    if (!userHasActiveJobs) {
      this.userRoundRobin.deleteByValue(job.data.userId);
    }
  }
}
