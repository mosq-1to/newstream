import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { FetchArticlesJob } from './fetch-articles.job';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';
import { TopicsService } from 'src/modules/topics/topics.service';
import { Cron, CronExpression } from '@nestjs/schedule';

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
  public async fetchArticlesPublishedLastTwoHours(relativeTo: Date = new Date()) {
    console.log(
      `[ArticlesFetchQueue] Fetching articles published last two hours at ${relativeTo?.toISOString()}`,
    );

    for (const topicKeywords of await this.topicsService.getAllKeywords()) {
      await this.addFetchArticlesJob({
        query: topicKeywords.map((keyword) => `"${keyword}"`).join(' OR '),
        fromDate: new Date(relativeTo.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        toDate: relativeTo.toISOString(),
      });
    }
  }

  public async fetchArticlesForGivenPeriod(fromDate: Date, toDate: Date) {
    for (let date = fromDate; date <= toDate; date.setHours(date.getHours() + 2)) {
      await this.fetchArticlesPublishedLastTwoHours(date);
    }
  }
}
