import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ValidateOtpDto {
  @ApiProperty({ example: 'John@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @MinLength(6)
  otp: string;
}

export class NewOtpDto {
  @ApiProperty({ example: 'John@gmail.com' })
  @IsEmail()
  email: string;
}
