import { Type } from "class-transformer";
import { IsArray, IsEmail, IsEnum, IsNumber, IsOptional, IsPhoneNumber, IsString, ValidateNested } from "class-validator";
import { EngagementModel } from "src/common/enums/user.enum";

class RangeDto {
    @IsOptional()
    @IsNumber()
    min: number;

    @IsOptional()
    @IsNumber()
    max: number;

    @IsOptional()
    @IsString()
    code: string;

}
class Industry {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    code: string;

}

export class CompanyProfileDto {
    @IsOptional()
    @IsString()
    companyName: string;

    @IsOptional()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    city: string;

    @IsOptional()
    @IsString()
    state: string;

    @IsOptional()
    @IsString()
    postalCode: string;

    @IsOptional()
    @IsString()
    country: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => Industry)
    industry: Industry;

    @IsOptional()
    @ValidateNested()
    @Type(() => RangeDto)
    revenue: RangeDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => RangeDto)
    employees: RangeDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => RangeDto)
    yearsInBusiness: RangeDto;
}

export class CompanyContactDto {
    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    jobTitle: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsPhoneNumber('NG')
    phone?: string;
}


class FinancialGoalDto {
    @IsString()
    code: string;

    @IsString()
    name: string;
}

class AreaOfNeed {
    @IsString()
    code: string;

    @IsString()
    name: string;
}

export class UpdateCompanyDto {

    @IsOptional()
    @ValidateNested()
    @Type(() => CompanyProfileDto)
    companyinfo?: CompanyProfileDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => CompanyContactDto)
    contactPerson?: CompanyContactDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FinancialGoalDto)
    financialGoal?: FinancialGoalDto[];

    @IsOptional()
    @IsString()
    additionalChallenges?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AreaOfNeed)
    areaOfNeed?: AreaOfNeed[];

    @IsOptional()
    @IsString()
    additionalRequirement?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => RangeDto)
    engagementDuration: RangeDto;

    @IsOptional()
    @IsEnum(EngagementModel)
    preferredEngagementModel?: EngagementModel;

    @IsOptional()
    @IsArray()
    communicationPreferences?: ('email' | 'phone' | 'call' | 'in-person')[];

}

