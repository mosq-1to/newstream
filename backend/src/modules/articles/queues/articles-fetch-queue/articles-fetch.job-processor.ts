import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';

import { ArticlesRepository } from '../../articles.repository';
import { FetchArticlesFromApiUseCase } from '../../use-cases/fetch-articles-from-api.use-case';
import { FetchArticlesJob } from './fetch-articles.job';
import { ArticlesQueuesOrchestratorService } from '../../articles-queues-orchestrator.service';

@Processor(QueueName.ArticlesFetch)
export class ArticlesFetchJobProcessor extends WorkerHost {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly fetchArticlesUseCase: FetchArticlesFromApiUseCase,
    private readonly articlesQueuesOrchestratorService: ArticlesQueuesOrchestratorService,
  ) {
    super();
  }

  async process(job: FetchArticlesJob) {
    const articles = await this.fetchArticlesUseCase.execute({
      query: job.data.query,
      fromDate: job.data.fromDate ? new Date(job.data.fromDate) : undefined,
      toDate: job.data.toDate ? new Date(job.data.toDate) : undefined,
    });

    return await this.articlesRepository.saveArticles(
      articles.map((article) => ({
        title: article.title,
        url: article.url,
        sourceName: article.source.name,
        sourceUrl: article.source.url,
        // todo - use content from api once we have the paid subscription
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
