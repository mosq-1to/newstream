import { IsString } from 'class-validator';

export class TransformArticleDto {
  @IsString()
  articleId: string;
}
