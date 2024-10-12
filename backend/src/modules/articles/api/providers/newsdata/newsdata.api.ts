import { ArticlesApi } from '../../articles.api';
import { ArticleReadModel } from '../../read-models/article.read-model';
import { mapNewsdataArticleToArticleReadModel } from './newsdata-article.mapper';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NewsdataLatestNewsDto } from './dto/newsdata-latest-news.dto';

@Injectable()
export class NewsdataApi implements ArticlesApi {
  httpService: HttpService['axiosRef'];

  constructor(
    httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.httpService = httpService.axiosRef;
  }

  async getArticles(): Promise<ArticleReadModel[]> {
    const response = await this.httpService.get<NewsdataLatestNewsDto>(
      'https://newsdata.io/api/1/latest?size=10&language=en',
      {
        headers: {
          'X-ACCESS-KEY': this.configService.get('NEWSDATA_API_KEY'),
        },
      },
    );

    const articles = response.data.results;

    return Promise.resolve(articles.map(mapNewsdataArticleToArticleReadModel));
  }
}
