import { IsNotEmpty, IsString } from 'class-validator';

export class ArticleReadModel {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  content: string;
}
