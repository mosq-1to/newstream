import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class BriefCreateDto {
  @IsString()
  @IsNotEmpty()
  topicId: string;

  @IsNotEmpty()
  @IsNumber()
  timeframeInDays: number;
}
