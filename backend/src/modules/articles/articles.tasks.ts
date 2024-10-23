import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EVERYDAY_AT_10_AND_20 } from '../../utils/time/cron-expressions';
import { ArticlesService } from './articles.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticlesTasks {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(EVERYDAY_AT_10_AND_20)
  async fetchLatestArticlesToDatabase() {
    if (this.configService.get('AUTO_ARTICLES_FETCHER_ENABLED') !== 'true') {
      return;
    }

    const articles = await this.articlesService.getLatestArticles();
    await this.articlesService.saveArticles(articles);

    console.log(
      `[${new Date().toISOString()}] Fetched ${articles.length} articles and saved to database`,
    );
  }
}
