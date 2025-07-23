import { Controller, Post } from '@nestjs/common';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { ArticlesService } from './articles.service';

@SkipAuth()
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('debug/fetch')
  async fetchArticles() {
    return this.articlesService.fetchAndSaveArticles();
  }
}
