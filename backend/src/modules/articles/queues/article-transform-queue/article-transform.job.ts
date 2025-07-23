import { Job } from 'bullmq';

export interface ArticleTransformJobData {
  articleId: string;
}

export class ArticleTransformJob extends Job<ArticleTransformJobData, string> {
  public readonly name = 'article-transform';
}
