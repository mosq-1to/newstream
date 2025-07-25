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

  @Cron(CronExpression.EVERY_HOUR)
  public async fetchArticlesPublishedLastHour() {
    console.log(
      `[ArticlesFetchQueue] Fetching articles published last hour at ${new Date().toISOString()}`,
    );

    const allKeywords = await this.topicsService.getAllKeywords();

    for (const topicKeywords of allKeywords) {
      await this.addFetchArticlesJob({
        query: topicKeywords.join(' OR '),
        fromDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
      });
    }
  }
}
