import { ArticleScrapingService } from '../article-scraping.service';

export class ExtractorScrapingStrategy implements ArticleScrapingService {
  async scrapeArticleContent(url: string): Promise<unknown> {
    const { extract } = await import('@extractus/article-extractor');

    return await extract(url);
  }
}
