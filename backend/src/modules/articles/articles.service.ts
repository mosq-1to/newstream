import { Injectable } from '@nestjs/common';
import { ArticlesFetchQueue } from './queues/articles-fetch-queue/articles-fetch.queue';
import { ArticleScrapeQueue } from './queues/article-scrape-queue/article-scrape.queue';
import { ArticleTransformQueue } from './queues/article-transform-queue/article-transform.queue';
import { ArticleCategorizeQueue } from './queues/article-categorize-queue/article-categorize.queue';
import { ArticlesRepository } from './articles.repository';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articlesFetchQueue: ArticlesFetchQueue,
    private readonly articleScrapeQueue: ArticleScrapeQueue,
    private readonly articleTransformQueue: ArticleTransformQueue,
    private readonly articleCategorizeQueue: ArticleCategorizeQueue,
    private readonly articleRepository: ArticlesRepository,
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

  async transformArticle(articleId: string) {
    await this.articleTransformQueue.addArticleTransformJob(articleId);
    return { job_started: true };
  }

  async categorizeArticle(articleId: string) {
    await this.articleCategorizeQueue.addArticleCategorizeJob(articleId);
    return { job_started: true };
  }

  async scrapeArticlesWithoutContent(articleIds: string[]) {
    const articles = await this.articleRepository.findByIds(articleIds);

    const articlesToScrape = articles.filter((article) => article.content.length < 100);
    await this.articleScrapeQueue.addArticleScrapeJobs(
      articlesToScrape.map((article) => article.id),
    );
  }
}
