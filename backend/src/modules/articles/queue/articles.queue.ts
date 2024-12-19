import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from '../../../types/queue-name.enum';
import { Queue } from 'bullmq';
import { ArticlesCreatedJob } from './jobs/articles-created.job';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticlesQueue {
  constructor(
    @InjectQueue(QueueName.Articles) private readonly articlesQueue: Queue,
  ) {}

  public emitArticlesCreated(articles: ArticlesCreatedJob['data']) {
    return this.articlesQueue.add(ArticlesCreatedJob.name, articles);
  }
}
