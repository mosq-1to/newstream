import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { NewsdataArticleDto } from "./newsdata-article.dto";
import { Type } from "class-transformer";

export enum NewsdataResponseStatus {
  Success = "success",
  Error = "error",
}

export class NewsdataLatestNewsDto {
  @IsEnum(NewsdataResponseStatus)
  @IsNotEmpty()
  status: NewsdataResponseStatus;

  @IsNumber()
  totalResults: number;

  @IsArray()
  @ValidateIf((o) => o.status === NewsdataResponseStatus.Success)
  @ValidateNested({ each: true })
  @Type(() => NewsdataArticleDto)
  results: NewsdataArticleDto[];
}
