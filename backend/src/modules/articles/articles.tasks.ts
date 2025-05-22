import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EVERYDAY_AT_10_AND_20 } from '../../utils/time/cron-expressions';
import { ConfigService } from '@nestjs/config';
import { FetchArticlesUseCase } from './use-cases/fetch-articles.use-case';

@Injectable()
export class ArticlesTasks {
  constructor(
    private readonly fetchArticlesUseCase: FetchArticlesUseCase,
    private readonly configService: ConfigService,
  ) { }

  @Cron(EVERYDAY_AT_10_AND_20)
  async fetchLatestArticlesToDatabase() {
    if (this.configService.get('AUTO_ARTICLES_FETCHER_ENABLED') !== 'true') {
      return;
    }

    const articles = await this.fetchArticlesUseCase.execute();

    console.log(
      `[${new Date().toISOString()}] Fetched ${articles.length} articles and saved to database in the background`,
    );
  }
}
