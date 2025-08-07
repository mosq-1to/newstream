import { Injectable } from '@nestjs/common';
import * as xml2json from 'xml2json';

export interface GoogleNewsRssImage {
  title: string;
  url: string;
  link: string;
  height: number;
  width: number;
}

export interface GoogleNewsRssItem {
  title: string;
  link: string;
  guid: {
    isPermaLink: boolean;
    $t: string;
  };
  pubDate: string;
  description: string;
  source: {
    url: string;
    $t: string;
  };
}

export interface GoogleNewsRssChannel {
  generator: string;
  title: string;
  link: string;
  language: string;
  webMaster: string;
  copyright: string;
  lastBuildDate: string;
  image: GoogleNewsRssImage;
  description: string;
  item: GoogleNewsRssItem[];
}

export interface GoogleNewsRssResponse {
  rss: {
    xmlns: {
      media: string;
    };
    version: string;
    channel: GoogleNewsRssChannel;
  };
}

export interface GoogleNewsRssSearchParams {
  ceid?: string;
  num?: number;
  q?: string;
}

interface FetchArticlesFromGoogleNewsRssUseCaseOptions {
  query: string;
}

@Injectable()
export class FetchArticlesFromGoogleNewsRssUseCase {
  private readonly baseUrl = 'https://news.google.com/rss';

  public async fetchLastTwoHours(
    options: FetchArticlesFromGoogleNewsRssUseCaseOptions,
  ): Promise<GoogleNewsRssItem[]> {
    return await this.fetchGoogleNewsRss({
      q: options.query + '+when:2h',
    });
  }

  private async fetchGoogleNewsRss(
    options: GoogleNewsRssSearchParams = {},
  ): Promise<GoogleNewsRssItem[]> {
    const params = new URLSearchParams();

    params.append('ceid', options.ceid || 'US:en');
    params.append('num', String(options.num || 10));
    if (options.q) params.append('q', options.q);

    const url = `${this.baseUrl}?${params.toString()}`;
    console.log('used URL: ', url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google News RSS error: ${response.statusText}`);
      }

      const xmlText = await response.text();
      const jsonResult = xml2json.toJson(xmlText, { object: true });
      return (jsonResult as unknown as GoogleNewsRssResponse).rss.channel.item;
    } catch (error) {
      console.error('Error fetching Google News RSS:', error);
      return [];
    }
  }
}
