import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as xml2js from "xml2js";
import { HttpsProxyAgent } from "https-proxy-agent";

export interface ArticleFilterOptions {
  /** Search query term */
  query?: string;
  /** Country/region code (e.g., 'US', 'GB', 'DE') */
  geolocation?: string;
  /** Language code (e.g., 'en-US', 'de') */
  language?: string;
  /** Start date in YYYY-MM-DD format */
  startDate?: string;
  /** End date in YYYY-MM-DD format */
  endDate?: string;
  /** Time range in format: number + unit (e.g., '1h', '24h', '7d', '1m') */
  timeRange?: string;
  /** News topic (e.g., 'h' for headlines, 'w' for world, etc.) */
  topic?: string;
}

@Injectable()
export class FetchArticlesUseCase {
  private readonly baseGoogleNewsRssUrl = "https://news.google.com/rss";

  constructor(private readonly configService: ConfigService) {}

  public async execute(options: ArticleFilterOptions = {}) {
    try {
      const proxyUrl = this.configService.getOrThrow<string>("HTTP_PROXY_URL");
      const proxyUser =
        this.configService.getOrThrow<string>("HTTP_PROXY_USER");
      const proxyPassword = this.configService.getOrThrow<string>(
        "HTTP_PROXY_PASSWORD"
      );

      const fetchOptions: any = {};

      if (proxyUrl) {
        const proxyAuth =
          proxyUser && proxyPassword
            ? `${encodeURIComponent(proxyUser)}:${encodeURIComponent(proxyPassword)}@`
            : "";
        const formattedProxyUrl = proxyUrl.includes("://")
          ? proxyUrl.replace("://", `://${proxyAuth}`)
          : `http://${proxyAuth}${proxyUrl}`;

        fetchOptions.agent = new HttpsProxyAgent(formattedProxyUrl);
      }

      const url = this.buildRssUrl(options);
      console.log(url);

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
      }

      const xmlContent = await response.text();

      const parser = new xml2js.Parser({
        explicitArray: false,
        normalize: true,
        normalizeTags: true,
      });

      const result = await parser.parseStringPromise(xmlContent);

      const items = result.rss.channel.item || [];

      const transformedArticles = items.map((item) => {
        const sourceName = item.source?._;
        const sourceUrl = item.source?.$ ? item.source.$.url : "";
        const sourceId = item.guid._;
        return {
          title: item.title || "",
          url: item.link || "",
          publishDate: item.pubdate || "",
          sourceName: sourceName || "",
          sourceUrl: sourceUrl || "",
          sourceId: sourceId || "",
        };
      });

      return transformedArticles;
    } catch (error) {
      console.error("Error fetching articles:", error);
      return [];
    }
  }

  private buildRssUrl(options: ArticleFilterOptions): string {
    const {
      query,
      geolocation,
      language,
      startDate,
      endDate,
      timeRange,
      topic,
    } = options;

    const params = new URLSearchParams();

    if (topic) {
      params.append("topic", topic);
    } else if (!query) {
      params.append("topic", "m");
    }

    const hl = language || "en-US";
    params.append("hl", hl);

    const gl = geolocation || "US";
    params.append("gl", gl);

    const ceid = `${gl}:${hl.split("-")[0]}`;
    params.append("ceid", ceid);

    let url = `${this.baseGoogleNewsRssUrl}`;

    if (query) {
      url = `${this.baseGoogleNewsRssUrl}/search`;
      let queryString = query;

      if (startDate && endDate) {
        queryString += ` after:${startDate} before:${endDate}`;
      } else if (timeRange && !startDate && !endDate) {
        queryString += ` when:${timeRange}`;
      }

      params.append("q", queryString);
    }

    return `${url}?${params.toString()}`;
  }
}
