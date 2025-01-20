import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { StoryGenerationQueue } from './story-generation.queue';
import { QueueName } from '../../../types/queue-name.enum';

@QueueEventsListener(QueueName.StoryGeneration)
export class StoryGenerationQueueListener extends QueueEventsHost {
  constructor(private readonly storyGenerationQueue: StoryGenerationQueue) {
    super();
  }

  @OnQueueEvent('completed')
  async handleCompletedJob({ jobId }: { jobId: string }) {
    console.log('Completed job:', jobId);
  }
  @OnQueueEvent('failed')
  async handleFailedJob(...args) {
    console.log('Failed job:', args);
  }
  @OnQueueEvent('active')
  async handleActiveJob(...args) {
    console.log('Active job:', args);
  }
}
