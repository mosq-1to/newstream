import { Injectable } from "@nestjs/common";
import { FetchArticlesUseCase } from "./use-cases/fetch-articles.use-case";
import { ArticlesQueue } from "./queue/articles.queue";
import { ArticlesRepository } from "./articles.repository";
import { FetchArticlesFromApiUseCase } from "./use-cases/fetch-articles-from-api.use-case";

@Injectable()
export class ArticlesService {
  constructor(
    private readonly fetchArticlesUseCase: FetchArticlesFromApiUseCase,
    private readonly articlesQueue: ArticlesQueue,
    private readonly articlesRepository: ArticlesRepository
  ) {}

  async fetchAndSaveArticles() {
    const articles = await this.fetchArticlesUseCase.fetchLastNDays(13, {
      q: "Artificial Intelligence",
    });

    // todo: hard-coded topicId for now, change it later
    void this.articlesQueue.addSaveArticlesJob(
      articles.map((article) => ({
        title: article.title,
        url: article.url,
        sourceName: article.source.name,
        sourceUrl: article.source.url,
        content: "",
        thumbnailUrl: article.image,
        topicId: "1b5831a4-a72d-4abe-9d4e-7c5bcf592c28",
        publishedAt: new Date(article.publishedAt),
      }))
    );

    return articles;
  }

  async scrapeAllArticles(batchSize: number) {
    const articles = await this.articlesRepository.getAllArticles({
      content: "",
    });
    await this.articlesQueue.addScrapeArticlesJob(articles.slice(0, batchSize));
    return { queued: articles.length };
  }
}
