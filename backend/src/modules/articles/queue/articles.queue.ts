import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from '../../../types/queue-name.enum';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { SaveArticlesJob } from './jobs/save-articles.job';

@Injectable()
export class ArticlesQueue {
  constructor(
    @InjectQueue(QueueName.Articles) private readonly articlesQueue: Queue,
  ) {}

  public addSaveArticlesJob(articles: SaveArticlesJob['data']) {
    return this.articlesQueue.add(SaveArticlesJob.name, articles);
  }
}
