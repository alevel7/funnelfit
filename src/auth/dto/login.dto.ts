import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'John@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'SME | CFO | ADMIN' })
  @IsEnum(['SME', 'CFO', 'ADMIN', 'REVIEWER', 'ENGAGEMENT_MANAGER'])
  role: string;
}
