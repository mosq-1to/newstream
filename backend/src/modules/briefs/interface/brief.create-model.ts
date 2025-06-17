import { IsString, IsNotEmpty } from "class-validator";

export class BriefCreateDto {
  @IsString()
  @IsNotEmpty()
  topicId: string;
}
