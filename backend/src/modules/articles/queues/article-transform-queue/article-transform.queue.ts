import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ArticleTransformJob } from './article-transform.job';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';

@Injectable()
export class ArticleTransformQueue {
  constructor(
    @InjectQueue(QueueName.ArticleTransform)
    private readonly queue: Queue,
  ) {}

  public async addArticleTransformJob(articleId: string) {
    await this.queue.add(ArticleTransformJob.name, { articleId }, { attempts: 3 });
  }

  public async addArticleTransformJobs(articleIds: string[]) {
    await this.queue.addBulk(
      articleIds.map((articleId) => ({
        name: ArticleTransformJob.name,
        data: { articleId },
        opts: { attempts: 3 },
      })),
    );
  }
}
