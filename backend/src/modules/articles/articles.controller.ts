import { Controller, Post } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('debug/fetch')
  async fetchArticles() {
    const articles = await this.articlesService.getLatestArticles();
    return await this.articlesService.saveArticles(articles);
  }
}
