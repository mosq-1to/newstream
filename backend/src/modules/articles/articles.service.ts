import { ArticleReadModel } from './api/read-models/article.read-model';
import { Injectable } from '@nestjs/common';
import { ArticlesRepository } from './articles.repository';

@Injectable()
export class ArticlesService {
  constructor(private readonly articlesRepository: ArticlesRepository) {}

  getLatestArticles() {
    return this.articlesRepository.fetchLatestArticles();
  }

  async getArticleById(articleId: string) {
    return this.articlesRepository.getArticleById(articleId);
  }

  async saveArticles(articles: ArticleReadModel[]) {
    await this.articlesRepository.saveArticles(articles);
  }
}
