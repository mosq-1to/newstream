import { Job } from 'bullmq';
import { Article } from '@prisma/client';

export class ArticlesCreatedJob extends Job {
  public readonly data: Article[];

  public readonly name = 'articles-created';
}
