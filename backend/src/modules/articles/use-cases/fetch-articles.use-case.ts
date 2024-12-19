import { ArticlesService } from '../articles.service';
import { ArticlesQueue } from '../articles.queue';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FetchArticlesUseCase {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly articlesQueue: ArticlesQueue,
  ) {}

  public async fetchArticles() {
    const articles = await this.articlesService.getLatestArticles();
    const savedArticles = await this.articlesService.saveArticles(articles);
    void this.articlesQueue.emitArticlesCreated(savedArticles);

    return savedArticles;
  }
}
