import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { SaveArticlesJob } from '../../articles/queue/jobs/save-articles.job';
import { Article } from '@prisma/client';
import { StoryGenerationQueue } from './story-generation.queue';
import { QueueName } from '../../../types/queue-name.enum';

@QueueEventsListener(QueueName.Articles)
export class StoryGenerationQueueListener extends QueueEventsHost {
  constructor(private readonly storyGenerationQueue: StoryGenerationQueue) {
    super();
  }

  @OnQueueEvent('completed')
  async handleCompletedJob(job: SaveArticlesJob, result: Article[]) {
    switch (job.name) {
      case SaveArticlesJob.name:
        await this.storyGenerationQueue.addGenerateStoryJob(result);
    }
  }
}
