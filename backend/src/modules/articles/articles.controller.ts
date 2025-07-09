import { Body, Controller, Post } from '@nestjs/common';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { ScrapeArticleContentUseCase } from './use-cases/scrape-article-content.use-case';
import { ArticlesService } from './articles.service';

@SkipAuth()
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly scrapeArticleContentUseCase: ScrapeArticleContentUseCase,
  ) {}

  @Post('debug/fetch')
  async fetchArticles() {
    return this.articlesService.fetchAndSaveArticles();
  }

  @Post('debug/scrape')
  async scrapeArticleContent(@Body() body: { url: string }) {
    return this.scrapeArticleContentUseCase.execute(body.url);
  }

  @Post('debug/scrapeAll')
  async scrapeAllArticles(@Body() body: { batchSize: number }) {
    return await this.articlesService.scrapeAllArticles(body.batchSize);
  }
}
