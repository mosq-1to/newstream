import { IsString } from 'class-validator';

export class ScrapeArticleDto {
  @IsString()
  articleId: string;
}
