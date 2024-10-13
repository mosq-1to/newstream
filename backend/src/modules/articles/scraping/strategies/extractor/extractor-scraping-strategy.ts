import { ArticleScrapingService } from '../../article-scraping.service';

export class ExtractorScrapingStrategy implements ArticleScrapingService {
  async scrapeArticleContent(url: string): Promise<string | null> {
    const { extract } = await import('@extractus/article-extractor');
    const articleData = await extract(url);

    return articleData.content ?? null;
  }
}
