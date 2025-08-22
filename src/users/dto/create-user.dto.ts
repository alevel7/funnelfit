import { IsBoolean, IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    phoneNumber: string;

    @IsBoolean()
    isVerified: boolean;

    @IsEnum(['SME', 'CFO', 'ADMIN', 'REVIEWER', 'ENGAGEMENT_MANAGER'])
    role: string;
}
