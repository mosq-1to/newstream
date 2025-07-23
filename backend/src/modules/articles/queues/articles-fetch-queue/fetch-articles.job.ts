import { Job } from 'bullmq';
import { Article } from '@prisma/client';

export class FetchArticlesJob extends Job<void, Article[]> {
  public readonly name = 'fetch-articles';
}
