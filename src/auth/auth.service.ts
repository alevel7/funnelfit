import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy'
import { UsersService } from 'src/users/users.service';
import { MessagingService } from 'src/messaging/messaging.service';
import { ApiResponse } from 'src/common/interface/api.interface';
import { ConfigService } from '@nestjs/config';
import { ValidateOtpDto } from './dto/validateOtp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly messagingService: MessagingService, // Assuming MessagingService is imported and available
  ) {}

  async register(dto: RegisterDto): Promise<ApiResponse<any>> {
    const { email, password, confirmPassword } = dto;
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');
    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
   
    const user = await this.userService.create({...dto});

    const secret = this.configService.getOrThrow('SECRET');
    // const secret = speakeasy.generateSecret({ length: 20 }).base32;
    // Generate 4-digit OTP
    const otp = speakeasy.totp({
      digits: 4,
      step: 500, // OTP valid for 5 minutes
      secret: secret,
      encoding: 'base32',
    });

    // Store the secret for later verification (e.g., in DB or cache)
    // For demonstration, we'll just log it
    console.log('OTP Secret (store this for verification):', secret);

    // To verify, use the same step and secret
    const t = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: otp,
      step: 500,
      // window: 10, // Allow a window for clock drift
    });
    console.log('OTP verification result:', t);

    // Send OTP via email
    await this.messagingService.queueEmail(
      email,
      'Your One-Time Password',
      `Your OTP is: ${otp}`,
      `<p>Your OTP is: <strong>${otp}</strong></p>`
    );

    return { 
      success: true,
      message: 'User created successfully. OTP sent to email.',
      data: user
    };
  }

  async validateOtp(dto: ValidateOtpDto): Promise<ApiResponse<any>> {
    const { otp } = dto;
    // Validate the OTP (this is just a placeholder, implement your own logic)
    const secret =this.configService.getOrThrow('SECRET');

    const isValid = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: otp,
    });
    // if (!isValid) throw new BadRequestException('Invalid OTP');
    this.userService.updateByEmail(dto.email, { isVerified: true });
    return {
      success: true,
      message: 'OTP validated successfully',
      data: null,
    };
  }

  async login(dto: LoginDto): Promise<ApiResponse<{ user: User; token: string }>> {
    const user = await this.userRepo.findOne({ where: { email: dto.email, role: dto.role } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isVerified) throw new UnauthorizedException('User not verified. Please validate your OTP.');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      },
    };
  }
}
