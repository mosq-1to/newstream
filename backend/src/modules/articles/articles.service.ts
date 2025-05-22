import { Injectable } from '@nestjs/common';
import { FetchArticlesUseCase } from './use-cases/fetch-articles.use-case';
import { ArticlesQueue } from './queue/articles.queue';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly fetchArticlesUseCase: FetchArticlesUseCase,
    private readonly articlesQueue: ArticlesQueue,
  ) { }

  async fetchAndSaveArticles() {
    const articles = await this.fetchArticlesUseCase.execute();

    // todo: hard-coded topicId for now, change it later
    void this.articlesQueue.addSaveArticlesJob(
      articles.map((article) => ({
        title: article.title,
        url: article.url,
        sourceId: article.sourceName, // Using sourceName as sourceId
        source: article.sourceName,
        content: '', // Will be populated later when needed
        topicId: '1b5831a4-a72d-4abe-9d4e-7c5bcf592c28',
      })),
    );

    return articles;
  }
}
