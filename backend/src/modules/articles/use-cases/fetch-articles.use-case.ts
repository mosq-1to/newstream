import { ArticlesService } from '../articles.service';
import { Injectable } from '@nestjs/common';
import { ArticlesQueue } from '../queue/articles.queue';

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
