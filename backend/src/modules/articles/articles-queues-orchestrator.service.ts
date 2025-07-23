import { Injectable } from '@nestjs/common';
import { ArticleScrapeQueue } from './queues/article-scrape-queue/article-scrape.queue';
import { Article } from '@prisma/client';

@Injectable()
export class ArticlesQueuesOrchestratorService {
  constructor(private readonly articleScrapeQueue: ArticleScrapeQueue) {}

  public async onArticlesFetched(articlesFetched: Article[]) {
    console.log('fetched articles', articlesFetched);
    await this.articleScrapeQueue.addArticleScrapeJobs(
      articlesFetched.filter((article) => article.relevant).map((article) => article.id),
    );
  }
}
