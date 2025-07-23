import { Injectable } from '@nestjs/common';
import { ArticlesFetchQueue } from './queues/articles-fetch-queue/articles-fetch.queue';
import { ArticleScrapeQueue } from './queues/article-scrape-queue/article-scrape.queue';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articlesFetchQueue: ArticlesFetchQueue,
    private readonly articleScrapeQueue: ArticleScrapeQueue,
  ) {}

  async fetchAndSaveArticles() {
    await this.articlesFetchQueue.addFetchArticlesJob();
    return { job_started: true };
  }

  async scrapeArticle(articleId: string) {
    await this.articleScrapeQueue.addArticleScrapeJob(articleId);
    return { job_started: true };
  }

  async scrapeArticles(articleIds: string[]) {
    await this.articleScrapeQueue.addArticleScrapeJobs(articleIds);
    return { job_started: true };
  }
}
