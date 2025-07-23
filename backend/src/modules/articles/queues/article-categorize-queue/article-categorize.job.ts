import { Job } from 'bullmq';

export interface ArticleCategorizeJobData {
  articleId: string;
}

export class ArticleCategorizeJob extends Job<ArticleCategorizeJobData, string /* topic name */> {
  public readonly name = 'article-categorize';
}
