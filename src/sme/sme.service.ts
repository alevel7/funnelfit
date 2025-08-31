import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggedInUser } from 'src/common/interface/jwt.interface';
import { UpdateCompanyDto } from './dto/sme.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SMEProfile } from 'src/entities/sme-profile.entity';
import { Repository } from 'typeorm';
import { SendResponse } from 'src/common/utils/responseHandler';
import { CFOProfile } from 'src/entities/cfo-profile.entity';

@Injectable()
export class SmeService {
    constructor(@InjectRepository(SMEProfile)
    private readonly smeRepo: Repository<SMEProfile>,) {}

  async findSMEById(id: string) {
      const smeProfile = await this.smeRepo.findOne({
      where: { user: { id } },
      relations: ['user'],
    });
    if (!smeProfile) throw new NotFoundException('SME Profile not found');
    return SendResponse.success<SMEProfile>(smeProfile, 'SME Profile fetched successfully');
  }

    async updateProfile(id:string, body: UpdateCompanyDto) {
        console.log(body)
        const sme = await this.smeRepo.findOne({ where: { user: { id } } });
        if (sme) {
            // User exists, proceed with the update
            const updatedUser = Object.assign(sme, body);
            await this.smeRepo.save(updatedUser);
            return this.findSMEById(id);
        } else {
            // User does not exist, insert new record into the database
            const newUser = this.smeRepo.create({ user: { id }, ...body });
            await this.smeRepo.save(newUser);
            return this.findSMEById(id);
        }
    }
}
