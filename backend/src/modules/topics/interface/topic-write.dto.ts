import { IsString } from 'class-validator';

export class TopicWriteDto {
  @IsString()
  title: string;

  @IsString()
  thumbnailUrl: string;

  @IsString()
  categoryTitle: string;
}
