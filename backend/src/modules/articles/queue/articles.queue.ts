import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from '../../../types/queue-name.enum';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { SaveArticlesJob } from './jobs/save-articles.job';
import { ScrapeArticleJob } from './jobs/scrape-article.job';
import { Article } from '@prisma/client';

@Injectable()
export class ArticlesQueue {
  constructor(@InjectQueue(QueueName.Articles) private readonly articlesQueue: Queue) {}

  public addSaveArticlesJob(articles: SaveArticlesJob['data']) {
    return this.articlesQueue.add(SaveArticlesJob.name, articles);
  }

  public addScrapeArticleJob(article: Article) {
    return this.articlesQueue.add(ScrapeArticleJob.name, article);
  }

  public addScrapeArticlesJob(articles: Article[]) {
    return articles.map((article) => this.addScrapeArticleJob(article));
  }
}
