import { Injectable } from '@nestjs/common';
import {
  ArticleReadModel,
  ArticleSource,
} from '../../read-models/article.read-model';
import { WorldNewsArticleDto } from './dto/world-news-article.dto';

@Injectable()
export class WorldNewsArticleMapper {
  constructor() {}

  async mapWorldNewsArticleToArticleReadModel(
    worldNewsArticle: WorldNewsArticleDto,
  ): Promise<ArticleReadModel> {
    return {
      sourceId: `${worldNewsArticle.id}`,
      source: ArticleSource.WorldNewsApi,
      title: worldNewsArticle.title,
      url: worldNewsArticle.url,
      content: worldNewsArticle.text,
    };
  }
}
