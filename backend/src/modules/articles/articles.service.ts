import { Injectable } from '@nestjs/common';
import { ArticlesFetchQueue } from './queues/articles-fetch-queue/articles-fetch.queue';

@Injectable()
export class ArticlesService {
  constructor(private readonly articlesFetchQueue: ArticlesFetchQueue) {}

  async fetchAndSaveArticles() {
    await this.articlesFetchQueue.addFetchArticlesJob();
    return { job_started: true };
  }
}
