import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/common/enums/user.enum';

export class LoginDto {
  @ApiProperty({ example: 'John@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  // @ApiProperty({ example: 'SME | CFO | ADMIN' })
  // @IsEnum(UserRole)
  // role: UserRole;
}


export enum LoginType  {
  STANDARD = 'STANDARD',
  GOOGLE = 'GOOGLE',
}