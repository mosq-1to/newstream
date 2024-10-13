import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ArticleScrapingService {
  abstract scrapeArticleContent(url: string): Promise<unknown>;
}
