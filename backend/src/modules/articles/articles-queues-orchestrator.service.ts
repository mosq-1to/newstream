import { Injectable } from '@nestjs/common';
import { ArticleCategorizeQueue } from './queues/article-categorize-queue/article-categorize.queue';
import { ArticleTransformQueue } from './queues/article-transform-queue/article-transform.queue';
import { Article } from '@prisma/client';
import { ArticlesService } from './articles.service';

@Injectable()
export class ArticlesQueuesOrchestratorService {
  constructor(
    private readonly articleCategorizeQueue: ArticleCategorizeQueue,
    private readonly articleTransformQueue: ArticleTransformQueue,
    private readonly articlesService: ArticlesService,
  ) {}

  public async onArticlesFetched(articlesFetched: Article[]) {
    const relevantArticles = articlesFetched.filter((article) => article.relevant);
    const articlesToScrape = relevantArticles.filter((article) => article.content.length < 100);
    const articlesToCategorize = relevantArticles.filter(
      (article) => article.content.length >= 100,
    );

    await this.articlesService.categorizeArticles(
      articlesToCategorize.map((article) => article.id),
    );
    await this.articlesService.scrapeArticles(articlesToScrape.map((article) => article.id));
  }

  public async onArticleScraped(article: Article) {
    if (!article.relevant) return;
    await this.articleCategorizeQueue.addArticleCategorizeJob(article.id);
  }

  public async onArticleCategorized(article: Article) {
    if (!article.relevant) return;
    await this.articleTransformQueue.addArticleTransformJob(article.id);
  }
}
