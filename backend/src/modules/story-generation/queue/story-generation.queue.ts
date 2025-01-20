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
    console.log('Adding generate story job for articles:', articles.length);
    for (const article of articles) {
      await this.storyGenerationQueue.add(GenerateStoryJob.name, article, {
        jobId: `article-${article.id}`,
      });
    }
  }
}
