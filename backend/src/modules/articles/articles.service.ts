import { ArticleReadModel } from './api/read-models/article.read-model';
import { Injectable } from '@nestjs/common';
import { ArticlesRepository } from './articles.repository';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { Queue } from 'bullmq';
import { ArticlesCreatedJob } from './jobs/articles-created.job';
import { Article } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    @InjectQueue(QueueName.Articles) private readonly articlesQueue: Queue,
  ) {}

  getLatestArticles() {
    return this.articlesRepository.fetchLatestArticles();
  }

  async saveArticles(articles: ArticleReadModel[]) {
    const savedArticles = await this.articlesRepository.saveArticles(articles);
    this.emitArticlesCreatedJob(savedArticles);

    return savedArticles;
  }

  emitArticlesCreatedJob(articles: Article[]) {
    void this.articlesQueue.add(ArticlesCreatedJob.name, articles);
  }
}
