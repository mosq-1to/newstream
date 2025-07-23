import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';

import { ArticlesRepository } from '../../articles.repository';
import { FetchArticlesFromApiUseCase } from '../../use-cases/fetch-articles-from-api.use-case';
import { TopicsService } from 'src/modules/topics/topics.service';

@Processor(QueueName.ArticlesFetch)
export class ArticlesFetchJobProcessor extends WorkerHost {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly fetchArticlesUseCase: FetchArticlesFromApiUseCase,
    private readonly topicsService: TopicsService,
  ) {
    super();
  }

  async process() {
    try {
      const allKeywords = await this.topicsService.getAllKeywords();
      const allKeywordsQuery = allKeywords.map((k) => `"${k}"`).join(' OR ');

      const articles = await this.fetchArticlesUseCase.fetchLastNDays(1, {
        q: allKeywordsQuery,
      });

      return this.articlesRepository.saveArticles(
        articles.map((article) => ({
          title: article.title,
          url: article.url,
          sourceName: article.source.name,
          sourceUrl: article.source.url,
          content: '',
          thumbnailUrl: article.image,
          publishedAt: new Date(article.publishedAt),
        })),
      );
    } catch (err) {
      console.error('[ArticlesFetchJobProcessor] Error fetching articles:', err);
    }
  }
}
