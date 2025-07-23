import { Injectable } from '@nestjs/common';
import { ArticlesFetchQueue } from './queue/articles-fetch.queue';

@Injectable()
export class ArticlesService {
  constructor(private readonly articlesFetchQueue: ArticlesFetchQueue) {}

  async fetchAndSaveArticles() {
    await this.articlesFetchQueue.addFetchArticlesJob();
    return { job_started: true };
  }
}
