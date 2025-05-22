import { Injectable } from '@nestjs/common';
import Firecrawl from '@mendable/firecrawl-js';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

// todo - move to an external ScraperModule

@Injectable()
export class ArticleScrapingService {
  private readonly firecrawl: Firecrawl;

  constructor(private readonly configService: ConfigService) {
    this.firecrawl = new Firecrawl({
      apiUrl: this.configService.getOrThrow('FIRECRAWL_API_URL'),
    });
  }

  async scrapeArticleContent(url: string): Promise<string> | null {
    const result = await this.firecrawl.scrapeUrl(url, {
      formats: ['json'],
      jsonOptions: {
        schema: z.object(
          {
            title: z.string(),
            content: z.string(),
          }
        )
      },
    });
    if (!result.success) {
      console.error(result.error);
      return null;
    }
    return result.json?.content;
  }
}
