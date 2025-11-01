import { IsBoolean, IsNumber, IsNumberString, IsOptional, IsString, IsUUID } from "class-validator"
import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class CfoRequestResultDto {
    @IsString()
    requestId: string;

    @Type(() => Number)
    @IsInt()
    page: number;
}


export class ClientRequestDto {
    @IsUUID()
    cfoId: string;

    @IsOptional()
    @IsString()
    scheduledMeetDate: string;

    @IsOptional()
    @IsBoolean()
    isRequestAccepted: boolean;

    @IsOptional()
    @IsBoolean()
    isMeetingCompleted: boolean;
}
