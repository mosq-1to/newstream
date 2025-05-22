import { ArticlesService } from '../articles.service';
import { Injectable } from '@nestjs/common';
import { ArticlesQueue } from '../queue/articles.queue';
import { ConfigService } from '@nestjs/config';
import * as xml2js from 'xml2js';

@Injectable()
export class FetchArticlesUseCase {
  private readonly googleNewsRssUrl = 'https://news.google.com/rss?topic=m&hl=en-US&gl=US&ceid=US:en';

  constructor(
    private readonly articlesService: ArticlesService,
    private readonly articlesQueue: ArticlesQueue,
    private readonly configService: ConfigService,
  ) { }

  public async fetchArticles() {
    try {
      // Fetch RSS feed using native fetch
      const response = await fetch(this.googleNewsRssUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
      }

      // Get the XML content
      const xmlContent = await response.text();

      // Parse XML to JS object
      const parser = new xml2js.Parser({
        explicitArray: false,
        normalize: true,
        normalizeTags: true
      });

      const result = await parser.parseStringPromise(xmlContent);

      // Extract articles from the parsed RSS feed
      const items = result.rss.channel.item || [];
      const articles = Array.isArray(items) ? items : [items];

      // Transform the data into a consistent format
      const transformedArticles = articles.map(item => {
        // Extract source information from item.source
        const sourceName = item.source?._;
        const sourceUrl = item.source?.$ ? item.source.$.url : '';

        return {
          title: item.title || '',
          url: item.link || '',
          publishDate: item.pubdate || '',
          sourceName: sourceName || '',
          sourceUrl: sourceUrl || '',
        };
      });

      // todo: hard-coded topicId for now, change it later
      // void this.articlesQueue.addSaveArticlesJob(
      //   transformedArticles.map((article) => ({
      //     title: article.title,
      //     url: article.url,
      //     sourceId: article.sourceName, // Using sourceName as sourceId
      //     source: article.sourceName,
      //     content: '', // Will be populated later when needed
      //     topicId: '1b5831a4-a72d-4abe-9d4e-7c5bcf592c28',
      //   })),
      // );

      return transformedArticles;
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }
}
