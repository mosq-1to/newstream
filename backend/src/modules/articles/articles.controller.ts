import { Body, Controller, Post } from '@nestjs/common';
import { ScrapeArticleDto } from './dto/scrape-article.dto';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { ArticlesService } from './articles.service';
import { TransformArticleDto } from './dto/transform-article.dto';
import { CategorizeArticleDto } from './dto/categorize-article.dto';
import { FetchArticlesForGivenPeriodDto } from './dto/fetch-articles-for-given-period.dto';

@SkipAuth()
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('debug/categorizeArticle')
  async categorizeArticle(@Body() dto: CategorizeArticleDto) {
    return this.articlesService.categorizeArticle(dto.articleId);
  }

  @Post('debug/fetch')
  async fetchArticles() {
    return this.articlesService.fetchAndSaveArticles();
  }

  @Post('debug/fetchForPeriod')
  async fetchArticlesForGivenPeriod(@Body() dto: FetchArticlesForGivenPeriodDto) {
    return this.articlesService.fetchArticlesForGivenPeriod(dto.fromDate, dto.toDate);
  }

  @Post('debug/scrapeArticle')
  async scrapeArticle(@Body() dto: ScrapeArticleDto) {
    return this.articlesService.scrapeArticle(dto.articleId);
  }

  @Post('debug/transformArticle')
  async transformArticle(@Body() dto: TransformArticleDto) {
    return this.articlesService.transformArticle(dto.articleId);
  }
}
