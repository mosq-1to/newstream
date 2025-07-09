import { Injectable } from '@nestjs/common';
import { ArticlesApi } from '../../articles.api';
import { HttpService } from '@nestjs/axios';
import { ArticleReadModel } from '../../read-models/article.read-model';
import { WorldNewsSearchNewsDto } from './dto/world-news-search-news.dto';
import { ConfigService } from '@nestjs/config';
import { WorldNewsArticleMapper } from './world-news-article.mapper';

@Injectable()
export class WorldNewsApi implements ArticlesApi {
  httpService: HttpService['axiosRef'];

  constructor(
    httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly worldNewsArticleMapper: WorldNewsArticleMapper,
  ) {
    this.httpService = httpService.axiosRef;
  }

  async getArticles(): Promise<ArticleReadModel[]> {
    const apiKey = this.configService.get('WORLDNEWS_API_KEY');

    const response = await this.httpService.get<WorldNewsSearchNewsDto>(
      `https://api.worldnewsapi.com/search-news?api-key=${apiKey}&language=en&number=20`,
    );

    const articles = response.data.news;
    const articleReadModels = await Promise.allSettled(
      articles.map(async (article) => {
        return await this.worldNewsArticleMapper.mapWorldNewsArticleToArticleReadModel(article);
      }),
    );
    const successfulArticles = articleReadModels
      .filter((article) => article.status === 'fulfilled')
      .map((article: PromiseFulfilledResult<ArticleReadModel>) => article.value);

    return successfulArticles.filter((article) => article.content !== null);
  }
}
