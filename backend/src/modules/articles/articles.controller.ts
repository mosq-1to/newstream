import { Body, Controller, Post } from '@nestjs/common';
import { FetchArticlesUseCase } from './use-cases/fetch-articles.use-case';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { ArticleScrapingService } from './scraping/article-scraping.service';

@SkipAuth()
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly fetchArticlesUseCase: FetchArticlesUseCase,
    private readonly articleScrapingService: ArticleScrapingService,
  ) { }

  @Post('debug/fetch')
  async fetchArticles() {
    return this.fetchArticlesUseCase.fetchArticles();
  }

  @Post('debug/scrape')
  async scrapeArticleContent(@Body() body: { url: string }) {
    return this.articleScrapingService.scrapeArticleContent(body.url);
  }
}
