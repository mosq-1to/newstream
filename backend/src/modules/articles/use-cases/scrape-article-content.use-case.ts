import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Firecrawl from '@mendable/firecrawl-js';
import { z } from 'zod';

@Injectable()
export class ScrapeArticleContentUseCase {
  private readonly firecrawl: Firecrawl;

  constructor(private readonly configService: ConfigService) {
    this.firecrawl = new Firecrawl({
      apiUrl: this.configService.getOrThrow('FIRECRAWL_API_URL'),
    });
  }

  public async execute(url: string): Promise<string | null> {
    const result = await this.firecrawl.scrapeUrl(url, {
      formats: ['json'],
      waitFor: 5000,
      removeBase64Images: true,
      jsonOptions: {
        schema: z.object({
          title: z.string(),
          content: z.string(),
        })
      },
    });

    if (!result.success) {
      console.error(result.error);
      return null;
    }

    return result.json?.content;
  }
}
