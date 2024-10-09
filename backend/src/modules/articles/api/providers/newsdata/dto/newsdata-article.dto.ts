import { IsNotEmpty, IsString } from 'class-validator';

export class NewsdataArticleDto {
  @IsString()
  @IsNotEmpty()
  article_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  content: string;
}
