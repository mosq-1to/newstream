import { Job } from 'bullmq';

export interface ArticleScrapeJobData {
  articleId: string;
}

export class ArticleScrapeJob extends Job<ArticleScrapeJobData, void> {
  public readonly name = 'article-scrape';
}
