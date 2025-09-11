import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggedInUser } from 'src/common/interface/jwt.interface';
import { UpdateCompanyDto } from './dto/sme.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SMEProfile } from 'src/entities/sme-profile.entity';
import { Repository } from 'typeorm';
import { SendResponse } from 'src/common/utils/responseHandler';
import { CFOProfile } from 'src/entities/cfo-profile.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class SmeService {
    constructor(@InjectRepository(SMEProfile)
    private readonly smeRepo: Repository<SMEProfile>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,) { }

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
            // User exists, proceed with the update
            // const isOnboarded = await this.isCfoOnboarded(user)
            // if (isOnboarded) {
            //     await this.userRepo.update({ id }, { isOnboarded: true });
            // }
            const updatedUser = Object.assign(sme, body);
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
}
