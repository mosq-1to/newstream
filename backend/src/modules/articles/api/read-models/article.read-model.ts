import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum ArticleSource {
  Newsdata = 'newsdata',
  WorldNewsApi = 'worldnewsapi',
}

export class ArticleReadModel {
  @IsString()
  @IsNotEmpty()
  sourceId: string;

  @IsEnum(ArticleSource)
  @IsNotEmpty()
  source: ArticleSource;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  content: string;

  @IsString()
  thumbnailUrl: string;
}
