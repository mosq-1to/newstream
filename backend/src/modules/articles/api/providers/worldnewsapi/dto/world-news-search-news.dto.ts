import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WorldNewsArticleDto } from './world-news-article.dto';

export class WorldNewsSearchNewsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorldNewsArticleDto)
  news: WorldNewsArticleDto[];
}
