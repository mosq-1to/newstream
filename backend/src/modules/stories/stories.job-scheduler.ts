import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queues } from '../../types/queues.enum';
import { Queue } from 'bullmq';
import { Article } from '@prisma/client';
import { StoriesGeneratedJob } from './jobs/stories-generated.job';

@Injectable()
export class StoriesJobScheduler {
  constructor(
    @InjectQueue(Queues.STORIES_QUEUE) private readonly storiesQueue: Queue,
  ) {}

  async addCreateStoriesFromArticles(articles: Article[]) {
    await this.storiesQueue.add(StoriesGeneratedJob.name, articles);
  }
}
