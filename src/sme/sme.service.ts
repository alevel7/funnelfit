import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggedInUser } from 'src/common/interface/jwt.interface';
import { CfoRequestDto, UpdateCompanyDto } from './dto/sme.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SMEProfile } from 'src/entities/sme-profile.entity';
import { Repository } from 'typeorm';
import { SendResponse } from 'src/common/utils/responseHandler';
import { CFOProfile } from 'src/entities/cfo-profile.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class SmeService {
    constructor(@InjectRepository(SMEProfile) private readonly smeRepo: Repository<SMEProfile>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(CFOProfile) private readonly cfoRepo: Repository<CFOProfile>,) { }

    async findSMEById(id: string) {
        const smeProfile = await this.userRepo.findOne({
            where: { id },
            relations: ['sme'],
        });
        return smeProfile
    }

    async updateProfile(id: string, body: UpdateCompanyDto) {
        const sme = await this.smeRepo.findOne({ where: { user: { id } } });
        if (sme) {
            // mark user as onboarded if all profile fields are filled
            const isOnboarded = await this.isSmeOnboarded(sme)
            // if isOnboarded is true, update the isOnboarded field in the users table
            if (isOnboarded) {
                await this.userRepo.update({ id }, { isOnboarded: true });
            }
            console.log("isOnboarded:", isOnboarded);
            const updatedUser = Object.assign(sme, { ...body, isOnboarded: isOnboarded });
            await this.smeRepo.save(updatedUser);
            const response = await this.findSMEById(id);
            return SendResponse.success(response, 'CFO Profile updated successfully');
        } else {
            // User does not exist, insert new record into the database
            const newCompany = this.smeRepo.create({ user: { id }, ...body });
            await this.smeRepo.save(newCompany);
            const response = await this.findSMEById(id);
            return SendResponse.success(response, 'CFO Profile created successfully');
        }
    }
    async isSmeOnboarded(sme: SMEProfile): Promise<boolean> {
        const isCompanyInfoComplete = !!sme?.companyinfo?.address &&
            !!sme?.companyinfo?.city &&
            !!sme?.companyinfo?.country &&
            !!sme?.companyinfo?.companyName &&
            !!sme?.companyinfo?.industry &&
            !!sme?.companyinfo?.postalCode &&
            !!sme?.companyinfo?.state;


        const isFinancialInfoComplete = sme?.financialGoal?.length > 0;


        const isCommunicationPreferenceComplete = sme?.communicationPreferences?.length > 0;


        const isAreaOfNeedComplete = sme?.areaOfNeed?.length > 0;


        const isContactInfoComplete = !!sme?.contactPerson?.firstName && !!sme?.contactPerson?.lastName && !!sme?.contactPerson?.jobTitle && !!sme?.contactPerson?.phoneNumber;

        if (isCompanyInfoComplete && isFinancialInfoComplete && isCommunicationPreferenceComplete && isAreaOfNeedComplete && isContactInfoComplete) {
            return true;
        }
        return false;
    }

    async requestCFO(data: CfoRequestDto) {
        const cfos = await this.cfoRepo.createQueryBuilder('cfo')
            .leftJoinAndSelect('cfo.user', 'user')
            .where(`
            EXISTS (
                SELECT 1 FROM jsonb_array_elements(cfo.expertiseAreas::jsonb) AS expertise 
                WHERE expertise ->> 'code' = :financialChallenge
            )`, { financialChallenge: data.financialChallenge.code })
            // .where(':financialChallenge = ANY (cfo.expertiseAreas::jsonb[]->>\'code\')', { financialChallenge: data.financialChallenge.code })
            .andWhere('cfo.engagementLength = :engagementTime', { engagementTime: data.engagementLength })
            .andWhere('cfo.preferredEngagementModel = :serviceType', { serviceType: data.serviceType })
            .andWhere("cfo.companySize ::jsonb ->> 'code' = :cfoExperience", { cfoExperience: data.cfoExperience })
            .getMany();

        return SendResponse.success(cfos, 'CFO request submitted successfully');
    }
}
