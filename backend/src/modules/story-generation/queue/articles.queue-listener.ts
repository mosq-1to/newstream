import {
  InjectQueue,
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { StoryGenerationQueue } from './story-generation.queue';
import { QueueName } from '../../../types/queue-name.enum';
import { Queue } from 'bullmq';

@QueueEventsListener(QueueName.Articles)
export class ArticlesQueueListener extends QueueEventsHost {
  constructor(
    private readonly storyGenerationQueue: StoryGenerationQueue,
    @InjectQueue(QueueName.Articles)
    private readonly articlesQueue: Queue,
  ) {
    super();
  }

  @OnQueueEvent('completed')
  async handleCompletedJob({ jobId }: { jobId: string }) {
    const job = await this.articlesQueue.getJob(jobId);
    console.log('SaveArticlesJob completed');
    console.log(job.name);
    console.log(job.returnvalue);

    // try {
    //   switch (job.name) {
    //     case SaveArticlesJob.name:
    //       await this.storyGenerationQueue.addGenerateStoryJob(result);
    //   }
    // } catch (e) {
    //   console.error(e);
    //   throw e;
    // }
  }
}
