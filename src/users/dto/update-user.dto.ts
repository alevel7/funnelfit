import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsBoolean, IsEmpty, IsEnum, isNumber, IsNumber, IsObject, IsOptional, IsPhoneNumber, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Optional } from '@nestjs/common';
import { AvailabilityType, EngagementModel } from 'src/common/enums/user.enum';
import { Type } from 'class-transformer';


export class CompanySizeDto {
    @Optional()
    @IsNumber()
    min?: number;

    @Optional()
    @IsNumber()
    max?: number;
}

export class UpdateCFODto  {

    @IsOptional()
    @IsPhoneNumber('NG')
    phone?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsUrl()
    linkedInUrl?: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    resumeUrl?: string;

    @Optional()
    @IsArray()
    certifications?: { certCode: string; name:string, url: string }[];

    @Optional()
    @IsArray()
    education?: { degree: string; institution: string; year: number }[];

    @IsOptional()
    @IsArray()
    industries?: { code: string, name: string }[];

    @IsOptional()
    @IsArray()
    expertiseAreas?: { code: string, name: string }[];

    @IsOptional()
    yearsOfExperience?: { min: number; max: number };

    @IsOptional()
    @ValidateNested()
    @Type(() => CompanySizeDto)
    companySize?: CompanySizeDto;

    @IsOptional()
    @IsNumber()
    rateExpectation?: number;

    @IsOptional()
    @IsEnum(AvailabilityType)
    availabilityType?: AvailabilityType;

    @IsOptional()
    @IsString()
    additionalPreference?: string;//

    @IsOptional()
    engagementLength?: { min: number; max: number, type: 'MONTHS' | 'YEARS' | 'OPEN_ENDED' | 'FLEXIBLE' };//

    @IsOptional()
    @IsEnum(EngagementModel)
    preferredEngagementModel?: EngagementModel;//

    @IsOptional()
    @IsString()
    workExpectationsAddedNote?: string;//
}


// export class CfoUpdateDto extends PartialType(UpdateUserDto) {}