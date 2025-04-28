import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import {
  GenerateStoryAudioJob,
  GenerateStoryAudioProcessChunkJob,
} from './jobs/generate-story-audio.job';
import { StoryAudioStorageRepository } from '../storage/story-audio-storage.repository';
import path from 'path';
import { AudioGenerationService } from '../audio-generation/audio-generation.service';
import { HlsService } from '../../utils/audio/hls.service';
import { StoryStreamFilesGenerationQueue } from '../story-stream-files-generation/story-stream-files-generation.queue';

@Processor(QueueName.StoryAudioGeneration, { concurrency: 1 })
export class StoryAudioGenerationJobProcessor extends WorkerHost {
  constructor(
    private readonly storyAudioStorageRepository: StoryAudioStorageRepository,
    private readonly audioGenerationService: AudioGenerationService,
    private readonly storyStreamFilesGenerationQueue: StoryStreamFilesGenerationQueue,
    private readonly hlsService: HlsService,
  ) {
    super();
  }

  async process(job: GenerateStoryAudioJob | GenerateStoryAudioProcessChunkJob) {
    // todo - think of a better way to extract the type of a job, perhaps use single job per queue
    if (job.name.startsWith('generate-story-audio-')) {
      if (job.name.includes('-process-chunk-')) {
        await this.processGenerateStoryAudioChunkJob(job as GenerateStoryAudioProcessChunkJob);
      } else {
        // await this.storyStreamFilesGenerationQueue.addGenerateStoryStreamFilesJob(
        //   job.data.storyId,
        //   true,
        // );
        // const { wavFiles, hlsOutputDir } = this.storyAudioStorageRepository.getStoryPaths(
        //   job.data.storyId,
        // );
        // await this.hlsService.createPlaylistFile(hlsOutputDir, wavFiles, true);
      }
    } else {
      throw new Error('StoryAudioGenerationJobProcessor.process(): Unknown job name');
    }
  }

  private readonly processGenerateStoryAudioChunkJob = async (
    job: GenerateStoryAudioProcessChunkJob,
  ) => {
    console.log('Processing chunk:', job.data.chunkIndex);
    try {
      const { wavOutputDir } = this.storyAudioStorageRepository.getStoryPaths(job.data.storyId);
      const wavFilePath = path.join(wavOutputDir, `audio-${job.data.chunkIndex}.wav`);

      await this.audioGenerationService.generateSpeechFromText(job.data.text, wavFilePath);
      // await this.storyStreamFilesGenerationQueue.addGenerateStoryStreamFilesJob(
      //   job.data.storyId,
      //   false,
      // );
      const { wavFiles, hlsOutputDir } = this.storyAudioStorageRepository.getStoryPaths(
        job.data.storyId,
      );
      await this.hlsService.createPlaylistFile(hlsOutputDir, wavFiles, false);
    } catch (e) {
      console.error('GenerateStoryAudioProcessChunkJob', e);
      throw e;
    }
  };
}
