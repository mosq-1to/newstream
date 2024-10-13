import { ArticlesApi } from './api/articles.api';
import { ArticleReadModel } from './api/read-models/article.read-model';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../utils/database/database.service';
import { ArticleScrapingService } from './scraping/article-scraping.service';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articlesApi: ArticlesApi,
    private readonly databaseService: DatabaseService,
    private readonly articleScrapingService: ArticleScrapingService,
  ) {}

  async getLatestArticles(): Promise<ArticleReadModel[]> {
    const articles = await this.articlesApi.getArticles();

    // TODO: move to the nwesdata.io mapper and use some other pattern to use the scraping service
    // Failing one of the promises will fail the whole Promise.all!!
    const articlesWithContent = await Promise.all(
      articles.map(async (article) => {
        try {
          // In case the article content is already fetched
          if (article.content.length > 100) return article;

          const content =
            await this.articleScrapingService.scrapeArticleContent(article.url);
          return { ...article, content };
        } catch (error) {
          console.error('Failed to fetch article content:', error);
          return { ...article, content: null }; // Handle failure
        }
      }),
    );

    return articlesWithContent;
  }

  async saveArticlesToDatabase(articles: ArticleReadModel[]): Promise<void> {
    await this.databaseService.article.createMany({
      data: articles,
      skipDuplicates: true,
    });
  }
}
