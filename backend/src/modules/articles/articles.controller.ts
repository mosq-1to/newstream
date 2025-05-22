import { Body, Controller, Post } from '@nestjs/common';
import { FetchArticlesUseCase } from './use-cases/fetch-articles.use-case';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { ScrapeArticleContentUseCase } from './use-cases/scrape-article-content.use-case';

@SkipAuth()
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly fetchArticlesUseCase: FetchArticlesUseCase,
    private readonly scrapeArticleContentUseCase: ScrapeArticleContentUseCase,
  ) { }

  @Post('debug/fetch')
  async fetchArticles() {
    return this.fetchArticlesUseCase.execute();
  }

  @Post('debug/scrape')
  async scrapeArticleContent(@Body() body: { url: string }) {
    return this.scrapeArticleContentUseCase.execute(body.url);
  }
}
