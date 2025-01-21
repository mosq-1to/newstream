import { ArticleReadModel } from './api/read-models/article.read-model';
import { Injectable } from '@nestjs/common';
import { ArticlesRepository } from './articles.repository';

@Injectable()
export class ArticlesService {
  constructor(private readonly articlesRepository: ArticlesRepository) {}

  getLatestArticles() {
    return this.articlesRepository.fetchLatestArticles();
  }

  saveArticles(articles: ArticleReadModel[]) {
    return this.articlesRepository.saveArticles(articles);
  }
}
