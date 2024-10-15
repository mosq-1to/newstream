import { NewsdataArticleDto } from './dto/newsdata-article.dto';
import {
  ArticleReadModel,
  ArticleSource,
} from '../../read-models/article.read-model';
import { Injectable } from '@nestjs/common';
import { ArticleScrapingService } from '../../../scraping/article-scraping.service';

@Injectable()
export class NewsdataArticleMapper {
  constructor(
    private readonly articleScrapingService: ArticleScrapingService,
  ) {}

  async mapNewsdataArticleToArticleReadModel(
    newsdataArticle: NewsdataArticleDto,
  ): Promise<ArticleReadModel> {
    return {
      sourceId: newsdataArticle.article_id,
      source: ArticleSource.Newsdata,
      title: newsdataArticle.title,
      url: newsdataArticle.link,
      content: await this.getArticleFullContent(newsdataArticle),
      thumbnailUrl: null,
    };
  }

  private async getArticleFullContent(
    newsdataArticle: NewsdataArticleDto,
  ): Promise<string> {
    if (newsdataArticle.content.length > 100) return newsdataArticle.content;

    return this.articleScrapingService.scrapeArticleContent(
      newsdataArticle.link,
    );
  }
}
