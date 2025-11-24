import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LoggedInUser } from 'src/common/interface/jwt.interface';
import { UpdateCompanyDto } from './dto/sme.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SMEProfile } from 'src/entities/sme-profile.entity';
import { Repository } from 'typeorm';
import { SendResponse } from 'src/common/utils/responseHandler';
import { CFOProfile } from 'src/entities/cfo-profile.entity';
import { User } from 'src/entities/user.entity';
import { CfoRequest } from 'src/entities/cfo-request.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ProducerService } from 'src/messaging/queue/producer.service';
import { ClientRequest } from 'src/entities/client-request.entity';
import { ClientRequestStatus } from 'src/common/enums/cfo-request.enum';


@Injectable()
export class SmeService {
  constructor(
    @InjectRepository(SMEProfile)
    private readonly smeRepo: Repository<SMEProfile>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(CFOProfile)
    private readonly cfoRepo: Repository<CFOProfile>,
    @InjectRepository(ClientRequest)
    private readonly clientRequestRepo: Repository<ClientRequest>,

    @InjectRepository(CfoRequest)
    private readonly cfoRequestRepo: Repository<CfoRequest>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly producerService: ProducerService,
  ) { }

  async findSMEById(id: string) {
    const smeProfile = await this.getSMeById(id);
    return SendResponse.success(smeProfile, 'Profile retrieved successfully');
  }

  async getSMeById(id: string) {
    const sme = await this.userRepo.findOne({
      where: { id },
      relations: ['sme'],
    });
    return sme;
  }

  async updateProfile(id: string, body: UpdateCompanyDto) {
    const sme = await this.smeRepo.findOne({ where: { user: { id } } });
    if (sme) {
      // mark user as onboarded if all profile fields are filled
      const isOnboarded = await this.isSmeOnboarded(sme);
      // if isOnboarded is true, update the isOnboarded field in the users table
      if (isOnboarded) {
        await this.userRepo.update({ id }, { isOnboarded: true });
      }
      console.log('isOnboarded:', isOnboarded);
      const updatedUser = Object.assign(sme, {
        ...body,
        isOnboarded: isOnboarded,
      });
      await this.smeRepo.save(updatedUser);
      const response = await this.getSMeById(id);
      return SendResponse.success(response, 'CFO Profile updated successfully');
    } else {
      // User does not exist, insert new record into the database
      const newCompany = this.smeRepo.create({ user: { id }, ...body });
      await this.smeRepo.save(newCompany);
      const response = await this.getSMeById(id);
      return SendResponse.success(response, 'CFO Profile created successfully');
    }
  }

  // --- Helper: create unique cache key for payload ---
  private async isSmeOnboarded(sme: SMEProfile): Promise<boolean> {
    const isCompanyInfoComplete =
      !!sme?.companyinfo?.address &&
      !!sme?.companyinfo?.city &&
      !!sme?.companyinfo?.country &&
      !!sme?.companyinfo?.companyName &&
      !!sme?.companyinfo?.industry &&
      !!sme?.companyinfo?.postalCode &&
      !!sme?.companyinfo?.state;

    const isFinancialInfoComplete = sme?.financialGoal?.length > 0;

    const isCommunicationPreferenceComplete =
      sme?.communicationPreferences?.length > 0;

    const isAreaOfNeedComplete = sme?.areaOfNeed?.length > 0;

    const isContactInfoComplete =
      !!sme?.contactPerson?.firstName &&
      !!sme?.contactPerson?.lastName &&
      !!sme?.contactPerson?.jobTitle &&
      !!sme?.contactPerson?.phoneNumber;

    if (
      isCompanyInfoComplete &&
      isFinancialInfoComplete &&
      isCommunicationPreferenceComplete &&
      isAreaOfNeedComplete &&
      isContactInfoComplete
    ) {
      return true;
    }
    return false;
  }

  async getSmeCfos(smeId: string) {
    // Find SME profile by user ID
    const smeProfile = await this.smeRepo.findOne({ where: { user: { id: smeId } } });
    if (!smeProfile) {
      throw new NotFoundException('SME Profile not found');
    }

    // Query client requests, join to cfoRequest, sme profile, and cfo profile
    const clientRequests = await this.clientRequestRepo.createQueryBuilder('clientRequest')
      .innerJoinAndSelect('clientRequest.request', 'cfoRequest')
      .innerJoin('cfoRequest.sme', 'smeProfile')
      .innerJoinAndSelect('clientRequest.cfo', 'cfoProfile')
      .where('smeProfile.id = :smeProfileId', { smeProfileId: smeProfile.id })
      .getMany();

    // Collect distinct CFOs from client requests
    const distinctCfosMap = new Map<string, CFOProfile>();
    clientRequests.forEach((request) => {
      if (request.cfo) {
        distinctCfosMap.set(request.cfo.id, request.cfo);
      }
    });
    const distinctCfos = Array.from(distinctCfosMap.values());

    return SendResponse.success(
      distinctCfos,
      'CFOs associated with SME retrieved successfully',
    );
  }
}
