import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ApiResponse<T = any> {
    @IsBoolean() success: boolean;
    @IsString() message: string;
    @IsOptional() data: T;
}