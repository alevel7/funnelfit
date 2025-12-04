import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsArray,
  IsBoolean,
  IsEmpty,
  IsEnum,
  isNumber,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Optional } from '@nestjs/common';
import {
  AvailabilityType,
  EngagementLength,
  EngagementModel,
} from 'src/common/enums/user.enum';
import { Type } from 'class-transformer';

export class CompanySizeDto {
  @Optional()
  @IsNumber()
  min?: number;

  @Optional()
  @IsNumber()
  max?: number;

  @Optional()
  @IsString()
  code?: string;
}

export class UpdateCFODto {
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

  @IsOptional()
  @IsArray()
  certifications?: { certCode: string; name: string; url: string }[];

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsArray()
  industries?: { code: string; name: string }[];

  @IsOptional()
  @IsArray()
  expertiseAreas?: { code: string; name: string }[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CompanySizeDto)
  yearsOfExperience?: CompanySizeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CompanySizeDto)
  companySize?: CompanySizeDto;

  @IsOptional()
  @IsString()
  rateExpectation?: string;

  @IsOptional()
  @IsEnum(AvailabilityType)
  availabilityType?: AvailabilityType;

  @IsOptional()
  @IsString()
  additionalPreference?: string; //

  @IsOptional()
  @IsEnum(EngagementLength)
  engagementLength?: EngagementLength;

  @IsOptional()
  @IsEnum(EngagementModel)
  preferredEngagementModel?: EngagementModel; //

  @IsOptional()
  @IsString()
  aboutMe?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

// export class CfoUpdateDto extends PartialType(UpdateUserDto) {}
