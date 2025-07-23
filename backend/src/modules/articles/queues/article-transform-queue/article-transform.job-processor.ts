import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';
import { ArticlesRepository } from '../../articles.repository';
import { ArticleTransformJob } from './article-transform.job';
import { TransformArticleUseCase } from '../../use-cases/transform-article.use-case';

@Processor(QueueName.ArticleTransform)
export class ArticleTransformJobProcessor extends WorkerHost {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly transformArticleUseCase: TransformArticleUseCase,
  ) {
    super();
  }

  async process(job: ArticleTransformJob) {
    const { articleId } = job.data;

    const article = await this.articlesRepository.getArticleById(articleId);
    if (!article) throw new Error('[ArticleTransformJobProcessor] Article not found');

    if (!article.relevant || !article.content) return;

    const transformedContent = await this.transformArticleUseCase.execute(
      article.title,
      article.content,
    );

    article.transformedContent = transformedContent;
    await this.articlesRepository.updateArticle(article);

    return transformedContent;
  }
}
