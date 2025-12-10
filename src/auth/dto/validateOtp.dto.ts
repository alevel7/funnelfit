import { IsEmail, IsString, MinLength } from 'class-validator';

export class ValidateOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  otp: string;
}

export class NewOtpDto {
  @IsEmail()
  email: string;
}
