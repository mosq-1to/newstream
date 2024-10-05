import { ArticlesApi } from '../../articles.api';
import { ArticleReadModel } from '../../read-models/article.read-model';
import { NewsdataArticleDto } from './newsdata-article.dto';
import { mapNewsdataArticleToArticleReadModel } from './newsdata-article.mapper';

export class NewsdataApi implements ArticlesApi {
  getArticles(): Promise<ArticleReadModel[]> {
    const mockArticles: NewsdataArticleDto[] = [
      {
        article_id: '1',
        title: 'Newsdata Article',
        link: 'https://newsdata.io',
        content: 'Newsdata content',
      },
      {
        article_id: '2',
        title: 'Newsdata Article 2',
        link: 'https://newsdata.io/2',
        content: 'Newsdata content 2',
      },
      {
        article_id: '3',
        title: 'Newsdata Article 3',
        link: 'https://newsdata.io/3',
        content: 'Newsdata content 3',
      },
    ];

    return Promise.resolve(
      mockArticles.map(mapNewsdataArticleToArticleReadModel),
    );
  }
}
