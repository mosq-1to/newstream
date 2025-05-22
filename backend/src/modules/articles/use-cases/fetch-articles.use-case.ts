import { ArticlesService } from '../articles.service';
import { Injectable } from '@nestjs/common';
import { ArticlesQueue } from '../queue/articles.queue';
import Firecrawl from '@mendable/firecrawl-js';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

@Injectable()
export class FetchArticlesUseCase {
  private readonly firecrawl: Firecrawl;
  private readonly googleNewsRssUrl = 'https://news.google.com/rss?topic=m&hl=en-US&gl=US&ceid=US:en';

  constructor(
    private readonly articlesService: ArticlesService,
    private readonly articlesQueue: ArticlesQueue,
    private readonly configService: ConfigService,
  ) {
    this.firecrawl = new Firecrawl({
      apiUrl: this.configService.getOrThrow('FIRECRAWL_API_URL'),
    });
  }

  public async fetchArticles() {
    try {
      const result = await this.firecrawl.scrapeUrl(this.googleNewsRssUrl, {
        formats: ['json'],
        timeout: 120 * 1000,
        jsonOptions: {
          schema: z.array(
            z.object(
              {
                title: z.string(),
                url: z.string(),
                publishDate: z.string(),
                sourceName: z.string(),
                sourceUrl: z.string(),
                thumbnailUrl: z.string(),
              }
            )
          )
        },
      });

      if (!result.success) {
        console.error('Failed to fetch articles:', result.error);
        return [];
      }

      const articles = result.json || [];

      // todo: hard-coded topicId for now, change it later
      // void this.articlesQueue.addSaveArticlesJob(
      //   articles.map((article) => ({
      //     title: article.title,
      //     url: article.url,
      //     thumbnailUrl: article.thumbnailUrl,
      //     sourceId: article.sourceName, // Using sourceName as sourceId
      //     source: article.sourceName,
      //     content: '', // Will be populated later when needed
      //     topicId: '1b5831a4-a72d-4abe-9d4e-7c5bcf592c28',
      //   })),
      // );

      return articles;
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }
}
