import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Firecrawl from '@mendable/firecrawl-js';

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
      formats: ['html'],
      waitFor: 5000,
      removeBase64Images: true,
    });

    if (!result.success) {
      console.error(result.error);
      return null;
    }

    return this.removeHtmlTags(result.html);
  }

  private removeHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}
