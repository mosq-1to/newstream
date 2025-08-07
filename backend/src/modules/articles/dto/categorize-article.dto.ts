import { IsString } from 'class-validator';

export class CategorizeArticleDto {
  @IsString()
  articleId: string;
}
