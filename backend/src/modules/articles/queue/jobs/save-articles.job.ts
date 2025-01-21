import { Job } from 'bullmq';
import { ArticleReadModel } from '../../api/read-models/article.read-model';
import { Article } from '@prisma/client';

export class SaveArticlesJob extends Job<ArticleReadModel[], Article[]> {
  public readonly name = 'save-articles';
}
