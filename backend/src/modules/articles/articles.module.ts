import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesApi } from './api/articles.api';
import { ArticlesTasks } from './articles.tasks';
import { DatabaseService } from '../../utils/database/database.service';
import { HttpModule } from '@nestjs/axios';
import { ArticleScrapingService } from './scraping/article-scraping.service';
import { ExtractorScrapingStrategy } from './scraping/strategies/extractor/extractor-scraping-strategy';
import { NewsdataArticleMapper } from './api/providers/newsdata/newsdata-article.mapper';
import { WorldNewsApi } from './api/providers/worldnewsapi/worldnews.api';
import { WorldNewsArticleMapper } from './api/providers/worldnewsapi/world-news-article.mapper';

@Module({
  imports: [HttpModule],
  providers: [
    DatabaseService,
    ArticlesService,
    NewsdataArticleMapper,
    WorldNewsArticleMapper,
    {
      provide: ArticlesApi,
      useClass: WorldNewsApi,
    },
    { provide: ArticleScrapingService, useClass: ExtractorScrapingStrategy },
    ArticlesTasks,
  ],
})
export class ArticlesModule {}
