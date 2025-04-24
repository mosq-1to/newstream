import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import {
  GenerateStoryAudioJob,
  GenerateStoryAudioProcessChunkJob,
} from './jobs/generate-story-audio.job';
import { StoryAudioStorageRepository } from '../storage/story-audio-storage.repository';
import path from 'path';

@Processor(QueueName.StoryAudioGeneration, { concurrency: 500 })
export class StoryAudioGenerationJobProcessor extends WorkerHost {
  constructor(private readonly storyAudioStorageRepository: StoryAudioStorageRepository) {
    super();
  }

  async process(job: GenerateStoryAudioJob | GenerateStoryAudioProcessChunkJob) {
    // todo - think of a better way to extract the type of a job, perhaps use single job per queue
    if (job.name.startsWith('generate-story-audio-')) {
      if (job.name.includes('-process-chunk-')) {
        return this.processGenerateStoryAudioChunkJob(job as GenerateStoryAudioProcessChunkJob);
      } else {
        return console.log('GenerateStoryAudioJob');
      }
    } else {
      throw new Error('StoryAudioGenerationJobProcessor.process(): Unknown job name');
    }
  }

  private readonly processGenerateStoryAudioChunkJob = async (
    job: GenerateStoryAudioProcessChunkJob,
  ) => {
    const { wavOutputDir } = this.storyAudioStorageRepository.getStoryPaths(job.data.storyId);
    const wavFilePath = path.join(wavOutputDir, `audio-${job.data.chunkIndex}`);

    /**
     * Steps:
     * 1. save the wav file in audio storage (StorageModule -> AudioStorageService, output: filePath)
     * 2. generate speech from the chunk (AudioGenerationService, input: filePath, text)
     * 3. Regenerate hls files for the story in the storage. (AudioGenerationService, input: wavFilesDir, outputDir)
     */
  };
}
