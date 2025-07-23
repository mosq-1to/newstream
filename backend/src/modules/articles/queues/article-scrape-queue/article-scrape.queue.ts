import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';
import { ArticleScrapeJob } from './article-scrape.job';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';

@Injectable()
export class ArticleScrapeQueue {
  constructor(
    @InjectQueue(QueueName.ArticleScrape)
    private readonly queue: Queue,
  ) {}

  public async addArticleScrapeJob(articleId: string) {
    await this.queue.add(ArticleScrapeJob.name, { articleId }, { attempts: 3 });
  }

  public async addArticleScrapeJobs(articleIds: string[]) {
    await this.queue.addBulk(
      articleIds.map((articleId) => ({
        name: ArticleScrapeJob.name,
        data: { articleId },
        opts: { attempts: 3 },
      })),
    );
  }
}
