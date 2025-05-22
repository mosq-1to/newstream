import { NewsdataArticleDto } from './dto/newsdata-article.dto';
import {
  ArticleReadModel,
  ArticleSource,
} from '../../read-models/article.read-model';
import { Injectable } from '@nestjs/common';
import { ScrapeArticleContentUseCase } from 'src/modules/articles/use-cases/scrape-article-content.use-case';

@Injectable()
export class NewsdataArticleMapper {
  constructor(
    private readonly scrapeArticleContentUseCase: ScrapeArticleContentUseCase,
  ) { }

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

    return this.scrapeArticleContentUseCase.execute(
      newsdataArticle.link,
    );
  }
}
