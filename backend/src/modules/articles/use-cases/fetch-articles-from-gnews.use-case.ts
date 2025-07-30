import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

function toGnewsApiUTCDateString(date: Date): string {
  // Returns 'YYYY-MM-DDTHH:mm:ssZ' (without milliseconds)
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export interface GNewsArticle {
  title: string;
  description: string;
  /** Only excerpt for free version */
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
  q: string;
  from?: Date;
  to?: Date;
  sortby?: 'publishedAt' | 'relevance';
  in?: ['title', 'description', 'content'];
  nullable?: ['image', 'description', 'content'];
}

interface FetchArticlesFromApiUseCaseOptions {
  query: string;
  fromDate?: Date;
  toDate?: Date;
}

@Injectable()
export class FetchArticlesFromGnewsUseCase {
  private readonly baseUrl = 'https://gnews.io/api/v4/top-headlines';

  constructor(private readonly configService: ConfigService) {}

  public async execute(options: FetchArticlesFromApiUseCaseOptions): Promise<GNewsArticle[]> {
    return await this.callGnewsApi({
      q: options.query,
      from: options.fromDate,
      to: options.toDate,
    });
  }

  private async callGnewsApi(options: GNewsOptions): Promise<GNewsArticle[]> {
    const apiKey = this.configService.getOrThrow<string>('GNEWS_API_KEY');
    const params = new URLSearchParams();

    params.append('apikey', apiKey);
    params.append('lang', options.lang || 'en');
    params.append('max', String(options.max || 10));
    params.append('sortby', options.sortby || 'publishedAt');
    params.append('in', options.in?.join(',') || 'title,description,content');
    params.append('nullable', options.nullable?.join(',') || 'image,description');
    params.append('country', options.country || 'any');
    if (options.category) params.append('category', options.category);
    params.append('q', options.q);
    if (options.from) params.append('from', toGnewsApiUTCDateString(options.from));
    if (options.to) params.append('to', toGnewsApiUTCDateString(options.to));

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
}
