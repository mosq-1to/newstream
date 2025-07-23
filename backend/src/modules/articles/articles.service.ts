import { Injectable } from '@nestjs/common';
import { ArticlesQueue } from './queue/articles.queue';
import { ArticlesRepository } from './articles.repository';
import { FetchArticlesFromApiUseCase } from './use-cases/fetch-articles-from-api.use-case';
import { TopicsService } from '../topics/topics.service';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly fetchArticlesUseCase: FetchArticlesFromApiUseCase,
    private readonly articlesQueue: ArticlesQueue,
    private readonly articlesRepository: ArticlesRepository,
    private readonly topicsService: TopicsService,
  ) {}

  async fetchAndSaveArticles() {
    const allKeywords = await this.topicsService.getAllKeywords();
    const allKeywordsQuery = allKeywords.map((k) => `"${k}"`).join(' OR ');

    this.fetchArticlesUseCase
      .fetchLastNDays(7, {
        q: allKeywordsQuery,
      })
      .then((articles) => {
        // todo: hard-coded topicId for now, change it later
        return this.articlesQueue.addSaveArticlesJob(
          articles.map((article) => ({
            title: article.title,
            url: article.url,
            sourceName: article.source.name,
            sourceUrl: article.source.url,
            content: '',
            thumbnailUrl: article.image,
            publishedAt: new Date(article.publishedAt),
          })),
        );
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
      });

    return { started: true };
  }

  async scrapeAllArticles(batchSize: number) {
    const articles = await this.articlesRepository.getAllArticles({
      content: '',
    });
    void this.articlesQueue.addScrapeArticlesJob(articles.slice(0, batchSize));
    return { queued: articles.length };
  }

  async scrapeSingleArticle(articleId: string) {
    const article = await this.articlesRepository.getArticleById(articleId);
    void this.articlesQueue.addScrapeArticleJob(article);
    return { queued: 1 };
  }
}
