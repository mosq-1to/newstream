import { IsString, IsArray } from 'class-validator';

export class TopicWriteDto {
  @IsString()
  title: string;

  @IsString()
  thumbnailUrl: string;

  @IsString()
  categoryTitle: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  keywords: string[];
}
