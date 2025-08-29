

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class UpdateSmeDto {

  @ApiProperty({ example: 'John@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'SME | CFO | ADMIN' })
  @IsEnum(['SME', 'CFO', 'ADMIN', 'REVIEWER', 'ENGAGEMENT_MANAGER'])
  role: string;
}
