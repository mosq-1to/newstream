import { QueueName } from '../../../types/queue-name.enum';
import { Article } from '@prisma/client';
import { GenerateStoryJob } from './jobs/generate-story.job';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StoryGenerationQueue {
  constructor(
    @InjectQueue(QueueName.StoryGeneration)
    private readonly storyGenerationQueue: Queue,
  ) {}

  async addGenerateStoryJob(articles: Article[]) {
    await this.storyGenerationQueue.addBulk(
      articles.map((article) => ({
        name: GenerateStoryJob.name,
        data: article,
        opts: {
          jobId: `article-${article.id}`,
          attempts: 30,
          backoff: { type: 'exponential', delay: 1000 },
        },
      })),
    );
  }
}
