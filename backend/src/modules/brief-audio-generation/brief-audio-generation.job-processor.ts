import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import {
  GenerateBriefAudioJob,
  GenerateBriefAudioProcessChunkJob,
} from './jobs/generate-brief-audio.job';
import { BriefAudioStorageRepository } from '../storage/brief-audio-storage.repository';
import path from 'path';
import { AudioGenerationService } from '../audio-generation/audio-generation.service';
import { HlsService } from '../../utils/audio/hls.service';

@Processor(QueueName.BriefAudioGeneration, { concurrency: 3 })
export class BriefAudioGenerationJobProcessor extends WorkerHost {
  constructor(
    private readonly briefAudioStorageRepository: BriefAudioStorageRepository,
    private readonly audioGenerationService: AudioGenerationService,
    private readonly hlsService: HlsService,
  ) {
    super();
  }

  async process(job: GenerateBriefAudioJob | GenerateBriefAudioProcessChunkJob) {
    // Check job type based on job name pattern
    if (job.name.startsWith('generate-brief-audio-')) {
      if (job.name.includes('-process-chunk-')) {
        await this.processGenerateBriefAudioChunkJob(job as GenerateBriefAudioProcessChunkJob);
      } else {
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
      const { wavOutputDir, hlsOutputDir } = this.briefAudioStorageRepository.getBriefPaths(
        job.data.briefId,
      );
      const wavFilePath = path.join(wavOutputDir, `audio-${job.data.chunkIndex}.wav`);

      await this.audioGenerationService.generateSpeechFromText(job.data.text, wavFilePath);
      await this.hlsService.appendPlaylistFile(hlsOutputDir, wavFilePath, job.data.chunkIndex);
    } catch (e) {
      console.error('GenerateBriefAudioProcessChunkJob', e);
      throw e;
    }
  };
}
