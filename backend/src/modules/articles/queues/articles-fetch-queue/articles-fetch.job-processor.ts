import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';

import { ArticlesRepository } from '../../articles.repository';
import { FetchArticlesFromGnewsUseCase } from '../../use-cases/fetch-articles-from-gnews.use-case';
import { FetchArticlesFromGoogleNewsRssUseCase } from '../../use-cases/fetch-articles-from-google-news-rss.use-case';
import { FetchArticlesJob } from './fetch-articles.job';
import { ArticlesQueuesOrchestratorService } from '../../articles-queues-orchestrator.service';

@Processor(QueueName.ArticlesFetch, {
  limiter: {
    max: 1,
    duration: 2000,
  },
})
export class ArticlesFetchJobProcessor extends WorkerHost {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly fetchArticlesUseCase: FetchArticlesFromGnewsUseCase,
    private readonly fetchArticlesFromGoogleNewsRssUseCase: FetchArticlesFromGoogleNewsRssUseCase,
    private readonly articlesQueuesOrchestratorService: ArticlesQueuesOrchestratorService,
  ) {
    super();
  }

  private async processUsingGnewsApi(job: FetchArticlesJob) {
    const articles = await this.fetchArticlesUseCase.execute({
      query: job.data.query,
      fromDate: job.data.fromDate ? new Date(job.data.fromDate) : undefined,
      toDate: job.data.toDate ? new Date(job.data.toDate) : undefined,
      expand: 'content',
    });

    return await this.articlesRepository.saveArticles(
      articles.map((article) => ({
        title: article.title,
        url: article.url,
        sourceName: article.source.name,
        sourceUrl: article.source.url,
        content: article.content,
        thumbnailUrl: article.image,
        publishedAt: new Date(article.publishedAt),
      })),
    );
  }

  private async processUsingGoogleNewsRss(job: FetchArticlesJob) {
    const articles = await this.fetchArticlesFromGoogleNewsRssUseCase.fetchLastTwoHours({
      query: job.data.query,
    });

    return await this.articlesRepository.saveArticles(
      articles.map((article) => ({
        title: article.title,
        url: article.link,
        sourceName: article.source.$t,
        sourceUrl: article.source.url,
        content: '',
        // todo - scrape thumbnail from article content
        thumbnailUrl: '',
        publishedAt: new Date(article.pubDate),
      })),
    );
  }

  async process(job: FetchArticlesJob) {
    return await this.processUsingGnewsApi(job);
    // return await this.processUsingGoogleNewsRss(job);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: FetchArticlesJob) {
    await this.articlesQueuesOrchestratorService.onArticlesFetched(job.returnvalue);
  }
}
