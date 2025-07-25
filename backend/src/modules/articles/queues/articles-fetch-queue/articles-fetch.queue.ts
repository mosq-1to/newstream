import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { FetchArticlesJob } from './fetch-articles.job';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';
import { TopicsService } from 'src/modules/topics/topics.service';

@Injectable()
export class ArticlesFetchQueue {
  constructor(
    @InjectQueue(QueueName.ArticlesFetch)
    private readonly queue: Queue,
    private readonly topicsService: TopicsService,
  ) {}

  public async addFetchArticlesJob(data: FetchArticlesJob['data']) {
    await this.queue.add(FetchArticlesJob.name, data);
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  public async fetchArticlesPublishedLastTwoHours() {
    console.log(
      `[ArticlesFetchQueue] Fetching articles published last two hours at ${new Date().toISOString()}`,
    );

    for (const topicKeywords of await this.topicsService.getAllKeywords()) {
      await this.addFetchArticlesJob({
        query: topicKeywords.map((keyword) => `"${keyword}"`).join(' OR '),
        fromDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      });
    }
  }
}
