export interface ArticleWriteDto {
  sourceName: string;
  sourceUrl?: string;
  title: string;
  url: string;
  content: string;
  thumbnailUrl: string;
  topicId: string;
  publishedAt: Date;
}
