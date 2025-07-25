import { Job } from 'bullmq';
import { Article } from '@prisma/client';

interface FetchArticlesJobData {
  query: string;
  fromDate?: Date;
  toDate?: Date;
}

export class FetchArticlesJob extends Job<FetchArticlesJobData, Article[]> {
  public readonly name = 'fetch-articles';
}
