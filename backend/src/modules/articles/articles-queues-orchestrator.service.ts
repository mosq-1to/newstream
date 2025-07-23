import { Injectable } from '@nestjs/common';
import { ArticleScrapeQueue } from './queues/article-scrape-queue/article-scrape.queue';
import { ArticleCategorizeQueue } from './queues/article-categorize-queue/article-categorize.queue';
import { Article } from '@prisma/client';

@Injectable()
export class ArticlesQueuesOrchestratorService {
  constructor(
    private readonly articleScrapeQueue: ArticleScrapeQueue,
    private readonly articleCategorizeQueue: ArticleCategorizeQueue,
  ) {}

  public async onArticlesFetched(articlesFetched: Article[]) {
    const relevantArticleIds = articlesFetched
      .filter((article) => article.relevant)
      .map((article) => article.id);

    await this.articleScrapeQueue.addArticleScrapeJobs(relevantArticleIds);
  }

  public async onArticleScraped(article: Article) {
    if (!article.relevant) return;
    await this.articleCategorizeQueue.addArticleCategorizeJob(article.id);
  }
}
