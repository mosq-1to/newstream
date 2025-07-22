import { Body, Controller, Post } from '@nestjs/common';
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

  @Post('debug/scrapeAll')
  async scrapeAllArticles(@Body() body: { batchSize: number }) {
    return this.articlesService.scrapeAllArticles(body.batchSize);
  }

  @Post('debug/scrape')
  async scrapeSingleArticle(@Body() body: { articleId: string }) {
    return this.articlesService.scrapeSingleArticle(body.articleId);
  }
}
