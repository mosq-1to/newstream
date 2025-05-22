import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as xml2js from 'xml2js';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class FetchArticlesUseCase {
  private readonly googleNewsRssUrl = 'https://news.google.com/rss?topic=m&hl=en-US&gl=US&ceid=US:en';

  constructor(
    private readonly configService: ConfigService,
  ) { }

  public async execute() {
    try {
      const proxyUrl = this.configService.getOrThrow<string>('HTTP_PROXY_URL');
      const proxyUser = this.configService.getOrThrow<string>('HTTP_PROXY_USER');
      const proxyPassword = this.configService.getOrThrow<string>('HTTP_PROXY_PASSWORD');

      const fetchOptions: any = {};

      if (proxyUrl) {
        const proxyAuth = proxyUser && proxyPassword
          ? `${encodeURIComponent(proxyUser)}:${encodeURIComponent(proxyPassword)}@`
          : '';
        const formattedProxyUrl = proxyUrl.includes('://')
          ? proxyUrl.replace('://', `://${proxyAuth}`)
          : `http://${proxyAuth}${proxyUrl}`;

        fetchOptions.agent = new HttpsProxyAgent(formattedProxyUrl);
      }

      const response = await fetch(this.googleNewsRssUrl, fetchOptions);

      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
      }

      const xmlContent = await response.text();

      const parser = new xml2js.Parser({
        explicitArray: false,
        normalize: true,
        normalizeTags: true
      });

      const result = await parser.parseStringPromise(xmlContent);

      const items = result.rss.channel.item || [];
      const articles = Array.isArray(items) ? items : [items];

      const transformedArticles = items.map(item => {
        const sourceName = item.source?._;
        const sourceUrl = item.source?.$ ? item.source.$.url : '';

        return {
          title: item.title || '',
          url: item.link || '',
          publishDate: item.pubdate || '',
          sourceName: sourceName || '',
          sourceUrl: sourceUrl || '',
        };
      });

      return transformedArticles;
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }
}
