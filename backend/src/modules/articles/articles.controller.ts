import { Controller, Post } from '@nestjs/common';
import { FetchArticlesUseCase } from './use-cases/fetch-articles.use-case';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly fetchArticlesUseCase: FetchArticlesUseCase) {}

  @Post('debug/fetch')
  async fetchArticles() {
    return this.fetchArticlesUseCase.fetchArticles();
  }
}
