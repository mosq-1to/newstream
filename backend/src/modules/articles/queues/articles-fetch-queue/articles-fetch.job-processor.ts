import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';

import { ArticlesRepository } from '../../articles.repository';
import { FetchArticlesFromApiUseCase } from '../../use-cases/fetch-articles-from-api.use-case';
import { TopicsService } from 'src/modules/topics/topics.service';
import { FetchArticlesJob } from './fetch-articles.job';
import { ArticlesQueuesOrchestratorService } from '../../articles-queues-orchestrator.service';

@Processor(QueueName.ArticlesFetch)
export class ArticlesFetchJobProcessor extends WorkerHost {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly fetchArticlesUseCase: FetchArticlesFromApiUseCase,
    private readonly topicsService: TopicsService,
    private readonly articlesQueuesOrchestratorService: ArticlesQueuesOrchestratorService,
  ) {
    super();
  }

  async process() {
    const allKeywords = await this.topicsService.getAllKeywords();
    const allKeywordsQuery = allKeywords.map((k) => `"${k}"`).join(' OR ');

    const articles = await this.fetchArticlesUseCase.fetchLastNHours(12, {
      q: allKeywordsQuery,
      sortby: 'relevance',
    });

    return await this.articlesRepository.saveArticles(
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
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: FetchArticlesJob) {
    await this.articlesQueuesOrchestratorService.onArticlesFetched(job.returnvalue);
  }
}
