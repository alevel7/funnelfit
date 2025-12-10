import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/common/enums/user.enum';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  // @ApiProperty({ example: 'SME | CFO | ADMIN' })
  // @IsEnum(UserRole)
  // role: UserRole;
}

export enum LoginType {
  STANDARD = 'STANDARD',
  GOOGLE = 'GOOGLE',
}
