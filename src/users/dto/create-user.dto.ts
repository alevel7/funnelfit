import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/common/enums/user.enum';
export class CreateUserDto {
 
  @IsEmail()
  email: string;

 
  @IsString()
  @MinLength(6)
  password: string;

 
  @IsPhoneNumber('NG')
  phoneNumber: string;

 
  @IsBoolean()
  isVerified: boolean;

  @IsEnum(UserRole) 
  role: UserRole;
}
