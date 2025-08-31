import { IsBoolean, IsEmail, IsEnum, IsPhoneNumber, IsString, MinLength } from 'class-validator';
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

    @IsEnum(['SME', 'CFO', 'ADMIN', 'REVIEWER', 'ENGAGEMENT_MANAGER'])
    role: string;
}
