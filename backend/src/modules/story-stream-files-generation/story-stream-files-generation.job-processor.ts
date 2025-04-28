import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { GenerateStoryStreamFilesJob } from './jobs/generate-story-stream-files.job';
import { HlsService } from '../../utils/audio/hls.service';
import { StoryAudioStorageRepository } from '../storage/story-audio-storage.repository';

@Processor(QueueName.StoryStreamFilesGeneration, {})
export class StoryStreamFilesGenerationJobProcessor extends WorkerHost {
  constructor(
    private readonly hlsService: HlsService,
    private readonly storyAudioStorageRepository: StoryAudioStorageRepository,
  ) {
    super();
  }

  async process(job: GenerateStoryStreamFilesJob) {
    if (job.name.startsWith('generate-story-stream-files-')) {
      return this.processGenerateStoryStreamFilesJob(job);
    } else {
      throw new Error('StoryStreamFilesGenerationJobProcessor.process(): Unknown job name');
    }
  }

  private readonly processGenerateStoryStreamFilesJob = async (
    job: GenerateStoryStreamFilesJob,
  ) => {
    try {
      console.log(`Processing stream files generation for Story#${job.data.storyId}`);
      const { wavFiles, hlsOutputDir } = this.storyAudioStorageRepository.getStoryPaths(
        job.data.storyId,
      );
      console.log('wavFiles', wavFiles);
      await this.hlsService.createPlaylistFile(hlsOutputDir, wavFiles, job.data.isFinal);
    } catch (e) {
      console.error('GenerateStoryStreamFilesJob error:', e);
      throw e;
    }
  };
}
