import { Injectable, UnauthorizedException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto, LoginType } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import { UsersService } from 'src/users/users.service';
import { ApiResponse } from 'src/common/interface/api.interface';
import { ConfigService } from '@nestjs/config';
import { ValidateOtpDto } from './dto/validateOtp.dto';
import { ProducerService } from 'src/messaging/queue/producer.service';
import { SendResponse } from 'src/common/utils/responseHandler';
import { PasswordResetDto } from './dto/password.dto';
import { UserRole } from 'src/common/enums/user.enum';
import { GoogleLoginMetaData } from 'src/common/interface/google.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly producerService: ProducerService,
  ) {
    authenticator.options = { digits: 6 };
  }

  async register(dto: RegisterDto): Promise<any> {
    const { email, password, confirmPassword } = dto;
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');
    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userService.create({ ...dto });

    const secret = this.configService.getOrThrow('SECRET');
    // const secret = speakeasy.generateSecret({ length: 20 }).base32;
    // Generate 4-digit OTP
    const otp = authenticator.generate(secret);

    // Send OTP via email
    await this.producerService.publishEmail({
      to: email,
      subject: 'Funnelfit: Your One-Time Password',
      body: `Your OTP is: ${otp}`,
    });
    console.log(user)
    return SendResponse.success(user, 'User created successfully. OTP sent to email.');

  };

  async validateOtp(dto: ValidateOtpDto) {
    const { otp } = dto;
    // Validate the OTP (this is just a placeholder, implement your own logic)
    const secret = this.configService.getOrThrow('SECRET');

    const isValid = authenticator.verify({ token: otp, secret });
    if (!isValid) throw new BadRequestException('Invalid OTP');
    this.userService.updateVerificationStatus(dto.email, { isVerified: true });
    const user = await this.userService.findUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return SendResponse.success({ token }, 'OTP validated successfully');
  }
  async getNewOtp(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const secret = this.configService.getOrThrow('SECRET');
    const otp = authenticator.generate(secret);
    await this.producerService.publishEmail({
      to: email,
      subject: 'Funnelfit: Your One-Time Password',
      body: `Your OTP is: ${otp}`,
    });
    return SendResponse.success(null, 'New OTP sent to email');
  }

  async login(dto: LoginDto) {
    let user = await this.userService.verifyUserExists(dto.email);
    if (user.role === UserRole.CFO) {
      user = await this.userService.findUserByEmail(dto.email, 'cfo') as User;
    } else {
      user = await this.userService.findUserByEmail(dto.email, 'sme') as User;
    }
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isVerified) throw new UnauthorizedException('User not verified. Please validate your OTP.');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return SendResponse.success({ user, token }, 'Login successful');
  }

  async resetPassword(dto: PasswordResetDto) {
    const { email, password, confirmPassword } = dto;
    const user = await this.userService.verifyUserExists(email);
    user.password = await bcrypt.hash(password, 10);
    await this.userRepo.save(user);
    return SendResponse.success(null, 'Password reset successfully');
  }

  async validateOAuthLogin(email: string, role: UserRole): Promise<User> {
    const existingUser = await this.userRepo.findOne({ where: { email: email } });
    if (existingUser) {
      return existingUser;
    }
    const pwd = ''
    const user = await this.userService.create({ email, role, password: pwd, confirmPassword: pwd, phoneNumber: '' });
    const secret = this.configService.getOrThrow('SECRET');
    const otp = authenticator.generate(secret);
    await this.producerService.publishEmail({
      to: email,
      subject: 'Funnelfit: Your One-Time Password',
      body: `Your OTP is: ${otp}`,
    });
    return user
  }

}
