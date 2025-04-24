import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import {
  GenerateStoryAudioJob,
  GenerateStoryAudioProcessChunkJob,
} from './jobs/generate-story-audio.job';

@Processor(QueueName.StoryAudioGeneration, { concurrency: 500 })
export class StoryAudioGenerationJobProcessor extends WorkerHost {
  async process(
    job: GenerateStoryAudioJob | GenerateStoryAudioProcessChunkJob,
  ) {
    // todo - think of a better way to extract the type of a job
    if (job.name.startsWith('generate-story-audio-')) {
      if (job.name.includes('-process-chunk-')) {
        return console.log('GenerateStoryAudioProcessChunkJob');
      } else {
        return console.log('GenerateStoryAudioJob');
      }
    } else {
      throw new Error(
        'StoryAudioGenerationJobProcessor.process(): Unknown job name',
      );
    }
  }
}
