import { Controller, Get } from '@nestjs/common';
import { ArticlesService } from './articles.service';

/*
 * TODO For testing purposes only, remove after
 * */

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  getLatestArticles() {
    return this.articlesService.getLatestArticles();
  }
}
