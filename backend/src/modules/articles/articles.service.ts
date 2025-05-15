import { Injectable } from '@nestjs/common';
import { ArticlesRepository } from './articles.repository';

@Injectable()
export class ArticlesService {
  constructor(private readonly articlesRepository: ArticlesRepository) { }

  getLatestArticles() {
    return this.articlesRepository.fetchLatestArticles();
  }
}
