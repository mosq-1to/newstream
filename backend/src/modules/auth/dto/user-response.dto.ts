import { IsEmail, IsString } from "class-validator";

export class UserResponseDto {
  @IsString()
  id: string;
  @IsEmail()
  email: string;
}
