import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { CfoUrgencyLevel, companySizeExperience, EngagementLength, EngagementModel } from 'src/common/enums/user.enum';

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

class FinancialChallenge {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code: string;
}

export class CfoRequestDto {
  @ValidateNested()
  @Type(() => FinancialChallenge)
  financialChallenge: FinancialChallenge;

  @IsEnum(CfoUrgencyLevel)
  urgencyLevel: CfoUrgencyLevel;

  @IsEnum(EngagementLength)
  engagementLength: EngagementLength;

  @IsEnum(EngagementModel)
  serviceType: EngagementModel;

  @IsEnum(companySizeExperience)
  cfoExperience: companySizeExperience;

  @IsOptional()
  otherRequirements: string;
}