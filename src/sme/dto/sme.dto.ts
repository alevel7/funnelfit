import { Type } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { EngagementModel } from "src/common/enums/user.enum";


export class CompanyProfileDto {
    companyName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    industry: string;
    revenue: { min: number, max: number, code: string }
    employees: { min: number, max: number, code: string }
    yearsInBusiness: { min: number, max: number, code: string }
}

export class CompanyContactDto {
    firstName: string;
    lastName: string;
    jobTitle: string;
    email?: string;
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
    @IsString()
    companyName?: string;

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
    addtionalRequirement?: string;

    @IsOptional()
    @IsEnum(EngagementModel)
    preferredEngagementModel?: EngagementModel;

    @IsOptional()
    @IsArray()
    communicationPreferences?: ('email' | 'phone' | 'call' | 'in-person')[];

}

