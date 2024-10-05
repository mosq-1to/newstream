import { ArticlesApi } from './api/articles.api';
import { ArticleReadModel } from './api/read-models/article.read-model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticlesService {
  constructor(private articlesApi: ArticlesApi) {}

  async getLatestArticles(): Promise<ArticleReadModel[]> {
    return await this.articlesApi.getArticles();
  }
}
