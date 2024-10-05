import { ArticlesApi } from './api/articles.api';
import { ArticleReadModel } from './api/read-models/article.read-model';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../utils/database/database.service';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articlesApi: ArticlesApi,
    private readonly databaseService: DatabaseService,
  ) {}

  async getLatestArticles(): Promise<ArticleReadModel[]> {
    return await this.articlesApi.getArticles();
  }

  async saveArticlesToDatabase(articles: ArticleReadModel[]): Promise<void> {
    await this.databaseService.article.createMany({ data: articles });
  }
}
