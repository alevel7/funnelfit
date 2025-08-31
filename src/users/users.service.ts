import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateCFODto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { SendResponse } from 'src/common/utils/responseHandler';
import { CFOProfile } from 'src/entities/cfo-profile.entity';

@Injectable()
export class UsersService {

    constructor(
      @InjectRepository(CFOProfile)
      private readonly cfoRepo: Repository<CFOProfile>,
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,
    ) {}

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
    return result
  }


  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const cfoProfile = await this.cfoRepo.findOne({
      where: { user: { id } },
      relations: ['user'],
    });
    if (!cfoProfile) throw new NotFoundException('CFO Profile not found');
    return SendResponse.success<CFOProfile>(cfoProfile, 'CFO Profile fetched successfully');
  }

  async update(id: string, updateUserDto: UpdateCFODto) {
    console.log(updateUserDto);
    
    // check if user with the id argument exists
    const user = await this.cfoRepo.findOne({ where: { user: { id } } });
    if (user) {
      // User exists, proceed with the update
      const updatedUser = Object.assign(user, updateUserDto);
      await this.cfoRepo.save(updatedUser);
      return this.findOne(id);
    } else {
      // User does not exist, insert new record into the database
      const newUser = this.cfoRepo.create({ user: { id }, ...updateUserDto });
      await this.cfoRepo.save(newUser);
      return this.findOne(id);
    }
  }

  async updateVerificationStatus(email:string, updateUserDto: {isVerified: boolean}) {
    return await this.userRepo.update({ email }, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  // helper methods
  async verifyUserExists(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Account not found');
    return user;
  }
  async findUserByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    return user;
  }

  async findUserById(id:string) {
    const user = await this.userRepo.findOne({ where: { id } });
    return user;
  }
}
