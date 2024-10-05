import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EVERYDAY_AT_10_AND_20 } from '../../utils/time/cron-expressions';
import { ArticlesService } from './articles.service';

@Injectable()
export class ArticlesTasks {
  constructor(private readonly articlesService: ArticlesService) {}

  @Cron(EVERYDAY_AT_10_AND_20)
  async fetchLatestArticlesToDatabase() {
    const articles = await this.articlesService.getLatestArticles();
    await this.articlesService.saveArticlesToDatabase(articles);
  }
}
