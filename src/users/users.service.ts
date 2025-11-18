import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateCFODto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { SendResponse } from 'src/common/utils/responseHandler';
import { CFOProfile } from 'src/entities/cfo-profile.entity';
import { ClientRequest } from 'src/entities/client-request.entity';
import { LoggedInUser } from 'src/common/interface/jwt.interface';
import { ClientRequestStatus } from 'src/common/enums/cfo-request.enum';
import {
  ClientRequestUpdateDto,
  ScheduleMeetingDto,
} from './dto/engagment-requests.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(CFOProfile)
    private readonly cfoRepo: Repository<CFOProfile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ClientRequest)
    private readonly clientRequestRepo: Repository<ClientRequest>,
  ) { }

  async create(createUserDto: RegisterDto) {
    const { email, password, phoneNumber, role } = createUserDto;
    const password_hash = await bcrypt.hash(password, 10);
    // Create user entity
    const user = this.userRepo.create({
      email,
      password: password_hash,
      phoneNumber,
      role,
    });
    const result = await this.userRepo.save(user);
    delete (result as any)?.password;
    return result;
  }

  async scheduleMeeting(clientRequestId: string, body: ScheduleMeetingDto, user: LoggedInUser) {
    const cfoProfile = await this.cfoRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (!cfoProfile) {
      throw new UnauthorizedException('CFO profile not found');
    }
    // find the client request by cfo id
    const clientRequest = await this.clientRequestRepo.findOne({
      where: {
        id: clientRequestId,
        cfoId: cfoProfile.id,
      },
    });
    if (!clientRequest) {
      throw new NotFoundException('Engagement request not found');
    }
    clientRequest.scheduledMeetDate = body.scheduledMeetDate;
    clientRequest.meetingDurationInMinutes = body.meetingDurationInMinutes;
    clientRequest.meetingMode = body.meetingMode;
    clientRequest.status = ClientRequestStatus.SCHEDULED;
    if (body.additionalNotes) {
      clientRequest.additionalNotes = body.additionalNotes;
    }
    await this.clientRequestRepo.save(clientRequest);
    return SendResponse.success(
      clientRequest,
      'Meeting scheduled successfully',
    );
  }

  async findOne(id: string) {
    const cfoProfile = await this.cfoRepo.findOne({
      where: { user: { id } },
      relations: ['user'],
    });
    if (!cfoProfile) throw new NotFoundException('CFO Profile not found');
    return SendResponse.success<CFOProfile>(
      cfoProfile,
      'CFO Profile fetched successfully',
    );
  }

  async update(id: string, updateUserDto: UpdateCFODto) {
    // check if user with the id argument exists
    const user = await this.cfoRepo.findOne({
      where: { user: { id } },
      relations: ['user'],
    });
    if (user) {
      // mark user as onboarded if all profile fields are filled
      const isOnboarded = await this.isCfoOnboarded(user);
      console.log('isOnboarded', isOnboarded);
      // if isOnboarded is true, update the isOnboarded field in the users table
      if (isOnboarded) {
        await this.userRepo.update({ id }, { isOnboarded: true });
      }
      // User exists, proceed with the update
      const updatedUser = Object.assign(user, updateUserDto);
      await this.cfoRepo.save(updatedUser);
      const response = await this.findUserById(id);
      return SendResponse.success(response, 'CFO Profile updated successfully');
    } else {
      // User does not exist, insert new record into the database
      const newUser = this.cfoRepo.create({ user: { id }, ...updateUserDto });
      await this.cfoRepo.save(newUser);
      const response = await this.findUserById(id);
      return SendResponse.success(response, 'CFO Profile updated successfully');
    }
  }
  async updateEngagementRequests(
    id: string,
    body: ClientRequestUpdateDto,
    user: LoggedInUser,
  ) {
    const cfoProfile = await this.cfoRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (!cfoProfile) {
      throw new UnauthorizedException('CFO profile not found');
    }
    // find the client request by cfo id
    const clientRequest = await this.clientRequestRepo.findOne({
      where: { id, cfoId: cfoProfile.id },
    });
    if (!clientRequest) {
      throw new NotFoundException('Engagement request not found');
    }
    clientRequest.status = body.status || clientRequest.status;
    clientRequest.rejectionReason = body.rejectionReason || clientRequest.rejectionReason;
    clientRequest.scheduledMeetDate = body.scheduledMeetDate || clientRequest.scheduledMeetDate;
    clientRequest.meetingDurationInMinutes = body.meetingDurationInMinutes || clientRequest.meetingDurationInMinutes;
    clientRequest.meetingMode = body.meetingMode || clientRequest.meetingMode;
    clientRequest.isRequestAccepted = body.isRequestAccepted || clientRequest.isRequestAccepted;
    clientRequest.isMeetingCompleted = body.isMeetingCompleted || clientRequest.isMeetingCompleted;

    await this.clientRequestRepo.save(clientRequest);
    return SendResponse.success(
      clientRequest,
      'Engagement request updated successfully',
    );
  }

  async getEngagementRequests(
    page: number = 1,
    limit: number = 10,
    status: ClientRequestStatus,
    user: LoggedInUser,
  ) {
    const take = Math.max(1, Math.min(limit || 10, 100));
    const skip = (Math.max(1, page) - 1) * take;

    const cfoProfile = await this.cfoRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (!cfoProfile) {
      throw new UnauthorizedException('CFO profile not found');
    }

    /*
    if the status is new, the return all records whose status is new and also records whose status is scheduled 
    and isMeetingCompleted is true.
    if the status is scheduled, return all records whose status is scheduled and isMeetingCompleted is false.
    */

    let queryBuilder = this.clientRequestRepo
      .createQueryBuilder('clientRequest')
      .leftJoinAndSelect('clientRequest.request', 'request') // include CfoRequest
      .leftJoinAndSelect('request.sme', 'sme') // include SMEProfile for each CfoRequest
      .orderBy('clientRequest.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .where('clientRequest.cfoId = :userId', { userId: cfoProfile.id });

    if (status === ClientRequestStatus.NEW) {
      queryBuilder = queryBuilder.andWhere(
        '(clientRequest.status = :newStatus OR (clientRequest.status = :scheduledStatus AND clientRequest.isMeetingCompleted = :completed))',
        {
          newStatus: ClientRequestStatus.NEW,
          scheduledStatus: ClientRequestStatus.SCHEDULED,
          completed: true
        }
      );
    } else if (status === ClientRequestStatus.SCHEDULED) {
      queryBuilder = queryBuilder.andWhere(
        'clientRequest.status = :scheduledStatus AND clientRequest.isMeetingCompleted = :notCompleted',
        {
          scheduledStatus: ClientRequestStatus.SCHEDULED,
          notCompleted: false
        }
      );
    } else {
      queryBuilder = queryBuilder.andWhere('clientRequest.status = :status', {
        status: status || ClientRequestStatus.NEW,
      });
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    const meta = {
      total,
      page,
      limit: take,
    };

    return SendResponse.success(
      { items, meta },
      'Engagement requests fetched successfully',
    );
  }

  // helper methods
  async isCfoOnboarded(cfo: CFOProfile): Promise<boolean> {
    // return await this.userRepo.update({ id }, { isOnboarded: true });
    if (
      cfo.firstName &&
      cfo.lastName &&
      cfo.certifications &&
      cfo.education &&
      cfo.expertiseAreas &&
      cfo.industries &&
      cfo.companySize &&
      cfo.yearsOfExperience &&
      cfo.rateExpectation &&
      cfo.availabilityType &&
      cfo.engagementLength &&
      cfo.preferredEngagementModel
    ) {
      return true;
    }
    return false;
  }
  async verifyUserExists(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Account not found');
    return user;
  }
  async updateVerificationStatus(
    email: string,
    updateUserDto: { isVerified: boolean },
  ) {
    return await this.userRepo.update({ email }, updateUserDto);
  }

  async findUserByEmail(email: string, role: 'sme' | 'cfo' | null = null) {
    let user;
    if (role) {
      user = await this.userRepo.findOne({
        where: { email },
        relations: [role],
      });
    } else {
      user = await this.userRepo.findOne({ where: { email } });
    }
    return user;
  }

  async findUserById(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['cfo'],
    });
    return user;
  }
}
