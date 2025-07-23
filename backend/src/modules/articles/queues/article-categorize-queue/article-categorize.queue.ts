import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ArticleCategorizeJob } from './article-categorize.job';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';

@Injectable()
export class ArticleCategorizeQueue {
  constructor(
    @InjectQueue(QueueName.ArticleCategorize)
    private readonly queue: Queue,
  ) {}

  public async addArticleCategorizeJob(articleId: string) {
    await this.queue.add(ArticleCategorizeJob.name, { articleId }, { attempts: 3 });
  }

  public async addArticleCategorizeJobs(articleIds: string[]) {
    await this.queue.addBulk(
      articleIds.map((articleId) => ({
        name: ArticleCategorizeJob.name,
        data: { articleId },
        opts: { attempts: 3 },
      })),
    );
  }
}
