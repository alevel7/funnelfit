import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {

    constructor(
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,
    ) {}

  async create(createUserDto: RegisterDto): Promise<User> {
    const { email, password, phoneNumber, role } = createUserDto;
    const password_hash = await bcrypt.hash(password, 10);
    // Create user entity
    const user = this.userRepo.create({
      email,
      password: password_hash,
      phoneNumber,
      role,
    });
    return await this.userRepo.save(user);
  }

  async verifyUserExists(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Account not found');
    return user;
  }
  async findUserByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(id, updateUserDto)
  }

  async updateByEmail(email:string, updateUserDto: UpdateUserDto) {
    return await this.userRepo.update({ email }, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
