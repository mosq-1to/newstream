import { Injectable } from '@nestjs/common';
import { Article } from '@prisma/client';
import { DatabaseService } from '../../utils/database/database.service';
import { ArticlesApi } from './api/articles.api';
import { ArticleReadModel } from './api/read-models/article.read-model';

@Injectable()
export class ArticlesRepository {
  constructor(
    private readonly articlesApi: ArticlesApi,
    private readonly databaseService: DatabaseService,
  ) { }

  async getAllArticles() {
    return this.databaseService.article.findMany();
  }

  async getArticleById(articleId: Article['id']) {
    return this.databaseService.article.findUnique({
      where: { id: articleId },
    });
  }

  async findByIds(articleIds: string[]): Promise<Article[]> {
    return this.databaseService.article.findMany({
      where: {
        id: {
          in: articleIds,
        },
      },
    });
  }

  async findByTopicId(topicId: string) {
    return this.databaseService.article.findMany({
      where: {
        topicId,
      },
    });
  }

  async fetchLatestArticles() {
    return this.articlesApi.getArticles();
  }

  async saveArticles(articles: ArticleReadModel[]) {
    return this.databaseService.article.createManyAndReturn({
      data: articles,
      skipDuplicates: true,
    });
  }
}
