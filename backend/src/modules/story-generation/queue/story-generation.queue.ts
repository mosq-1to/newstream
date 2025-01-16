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

  async addGenerateStoryJob(article: Article | Article[]) {
    if (Array.isArray(article)) {
      return await this.storyGenerationQueue.addBulk([
        { name: GenerateStoryJob.name, data: article },
      ]);
    }
    return await this.storyGenerationQueue.add(GenerateStoryJob.name, article);
  }
}
