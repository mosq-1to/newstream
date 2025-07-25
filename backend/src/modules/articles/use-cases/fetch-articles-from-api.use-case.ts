import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

function toApiDateString(date: Date): string {
  // Returns 'YYYY-MM-DDTHH:mm:ssZ' (without milliseconds)
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export interface GNewsArticle {
  title: string;
  description: string;
  /** Only excerpt */
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface GNewsOptions {
  category?: string;
  lang?: string;
  country?: string;
  max?: number;
  q?: string;
  from?: string;
  to?: string;
  sortby?: 'publishedAt' | 'relevance';
  in?: ['title', 'description', 'content'];
}

@Injectable()
export class FetchArticlesFromApiUseCase {
  private readonly baseUrl = 'https://gnews.io/api/v4/search';

  constructor(private readonly configService: ConfigService) {}

  async execute(options: GNewsOptions = {}): Promise<GNewsArticle[]> {
    const apiKey = this.configService.getOrThrow<string>('GNEWS_API_KEY');
    const params = new URLSearchParams();
    params.append('apikey', apiKey);
    params.append('lang', options.lang || 'en');
    params.append('country', options.country || 'us');
    params.append('max', String(options.max || 10));
    params.append('sortby', options.sortby || 'publishedAt');
    params.append('in', options.in?.join(',') || 'title,description,content');
    if (options.category) params.append('category', options.category);
    if (options.q) params.append('q', options.q);
    if (options.from) params.append('from', toApiDateString(new Date(options.from)));
    if (options.to) params.append('to', toApiDateString(new Date(options.to)));
    const url = `${this.baseUrl}?${params.toString()}`;

    console.log('used URL: ', url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`GNews API error: ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data.articles)) return [];
      console.log('fetched articles:', data.articles.length);
      return data.articles as GNewsArticle[];
    } catch (error) {
      return [];
    }
  }

  /** Warnign: Only for limited usage for debugging as it counts days improperly */
  async fetchLastNDays(nDays: number, options: GNewsOptions = {}): Promise<GNewsArticle[]> {
    function sleep(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const cumulativeArticles: GNewsArticle[] = [];
    const today = new Date();
    for (let i = 0; i < nDays; i++) {
      if (i > 0) {
        await sleep(2000);
      }
      const date = new Date(today);
      const date2 = new Date(today);
      date.setHours(0, 0, 0, 0);
      date2.setHours(0, 0, 0, 0);
      date.setDate(today.getDate() - i);
      date2.setDate(today.getDate() - i + 1);
      const dateStr = toApiDateString(date);
      const date2Str = toApiDateString(date2);
      // eslint-disable-next-line no-await-in-loop
      const articles = await this.execute({
        ...options,
        from: dateStr,
        to: date2Str,
      });
      if (Array.isArray(articles)) {
        cumulativeArticles.push(...articles);
      }
    }
    return cumulativeArticles;
  }

  async fetchLastNHours(nHours: number, options: GNewsOptions = {}): Promise<GNewsArticle[]> {
    const today = new Date();

    const dateStr = toApiDateString(new Date(today.getTime() - nHours * 60 * 60 * 1000));

    return await this.execute({
      ...options,
      from: dateStr,
    });
  }
}
