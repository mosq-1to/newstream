import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import {
  GenerateStoryAudioJob,
  GenerateStoryAudioProcessChunkJob,
} from './jobs/generate-story-audio.job';

@Processor(QueueName.StoryAudioGeneration, { concurrency: 500 })
export class StoryAudioGenerationJobProcessor extends WorkerHost {
  async process(job: GenerateStoryAudioJob | GenerateStoryAudioProcessChunkJob) {
    // todo - think of a better way to extract the type of a job
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
    /**
     * Steps:
     * 1. generate speech from the chunk (AudioGenerationModule)
     * 2. save the wav file in audio storage
     * 3. Regenerate hls files for the story in the storage.
     */
  };
}
