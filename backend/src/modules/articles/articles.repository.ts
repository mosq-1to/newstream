import { Injectable } from "@nestjs/common";
import { Article } from "@prisma/client";
import { DatabaseService } from "../../utils/database/database.service";
import { ArticlesApi } from "./api/articles.api";
import { ArticleWriteDto } from "./interface/article-write.dto";

@Injectable()
export class ArticlesRepository {
  constructor(
    private readonly articlesApi: ArticlesApi,
    private readonly databaseService: DatabaseService
  ) {}

  async getAllArticles(filterOptions?: { content?: string }) {
    return this.databaseService.article.findMany({
      where: {
        content: filterOptions?.content,
      },
    });
  }

  async getArticleById(articleId: Article["id"]) {
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

  async findByTopicId(topicId: string, publishedAfter?: Date) {
    return this.databaseService.article.findMany({
      where: {
        topicId,
        publishedAt: {
          gte: publishedAfter,
        },
      },
    });
  }

  async fetchLatestArticles() {
    return this.articlesApi.getArticles();
  }

  async saveArticles(articles: ArticleWriteDto[]) {
    return this.databaseService.article.createManyAndReturn({
      data: articles,
      skipDuplicates: true,
    });
  }

  async updateArticle(article: Article) {
    return this.databaseService.article.update({
      where: { id: article.id },
      data: article,
    });
  }
}
