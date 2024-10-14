import { ArticleScrapingService } from '../../article-scraping.service';

export class ExtractorScrapingStrategy implements ArticleScrapingService {
  async scrapeArticleContent(url: string): Promise<string | null> {
    const { extract } = await import('@extractus/article-extractor');

    let articleContent = null;
    try {
      const articleData = await extract(url);
      articleContent = articleData?.content ?? null;
    } catch (error) {
      console.error('Error while extracting article content', error);
    }

    return articleContent;
  }
}
