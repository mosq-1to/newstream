import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { FetchArticlesJob } from './fetch-articles.job';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';

@Injectable()
export class ArticlesFetchQueue {
  constructor(
    @InjectQueue(QueueName.ArticlesFetch)
    private readonly queue: Queue,
  ) {}

  public async addFetchArticlesJob() {
    await this.queue.add(FetchArticlesJob.name, {});
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleFetchArticlesCron() {
    console.log(
      `[ArticlesFetchQueue] Started fetching latest articles at ${new Date().toISOString()}`,
    );
    await this.addFetchArticlesJob();
  }
}
