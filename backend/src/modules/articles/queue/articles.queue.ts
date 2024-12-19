import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from '../../../types/queue-name.enum';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { ArticlesCreatedJob } from './jobs/articles-created.job';

@Injectable()
export class ArticlesQueue {
  constructor(
    @InjectQueue(QueueName.Articles) private readonly articlesQueue: Queue,
  ) {}

  public emitArticlesCreated(articles: ArticlesCreatedJob['data']) {
    return this.articlesQueue.add(ArticlesCreatedJob.name, articles);
  }
}
