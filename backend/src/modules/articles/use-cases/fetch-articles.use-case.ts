import { ArticlesService } from '../articles.service';
import { Injectable } from '@nestjs/common';
import { ArticlesQueue } from '../queue/articles.queue';

@Injectable()
export class FetchArticlesUseCase {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly articlesQueue: ArticlesQueue,
  ) { }

  public async fetchArticles() {
    const articles = await this.articlesService.getLatestArticles();
    // todo: hard-coded topicId for now, change it later
    void this.articlesQueue.addSaveArticlesJob(
      articles.map((article) => ({
        ...article,
        topicId: '1b5831a4-a72d-4abe-9d4e-7c5bcf592c28',
      })),
    );

    return articles;
  }
}
