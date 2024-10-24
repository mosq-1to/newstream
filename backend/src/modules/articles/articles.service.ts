import { ArticleReadModel } from './api/read-models/article.read-model';
import { Injectable } from '@nestjs/common';
import { ArticlesRepository } from './articles.repository';
import { StoriesService } from '../stories/stories.service';
import { Article } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly storiesService: StoriesService,
  ) {}

  getLatestArticles() {
    return this.articlesRepository.fetchLatestArticles();
  }

  async getArticleById(articleId: string) {
    return this.articlesRepository.getArticleById(articleId);
  }

  async saveArticles(articles: ArticleReadModel[]) {
    return this.articlesRepository.saveArticles(articles);
    //TODO Add notifier here and dont handle stories jobs internally
  }

  async addCreateStoriesFromArticlesJob(articles: Article[]) {
    await this.storiesService.addCreateStoriesFromArticlesJob(articles);
  }
}
