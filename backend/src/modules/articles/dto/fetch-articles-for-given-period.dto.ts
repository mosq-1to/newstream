import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class FetchArticlesForGivenPeriodDto {
  @IsDate()
  @Type(() => Date)
  fromDate: Date;

  @IsDate()
  @Type(() => Date)
  toDate: Date;
}
