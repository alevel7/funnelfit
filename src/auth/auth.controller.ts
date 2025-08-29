import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { NewOtpDto, ValidateOtpDto } from './dto/validateOtp.dto';
import { PasswordResetDto } from './dto/password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.', type: User })
  async register(@Body() dto: RegisterDto){
    return this.authService.register(dto);
  }

  @Post('otp/validate')
  async validateOtp(@Body() dto: ValidateOtpDto) {
    return this.authService.validateOtp(dto);
  }

  @Post('otp/new')
  async getNewOtp(@Body() dto: NewOtpDto) {
    return this.authService.getNewOtp(dto.email);
  }

  @Post("forgot-password")
  async getPasswordResetOtp(@Body() dto: NewOtpDto) {
    return this.authService.getNewOtp(dto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: PasswordResetDto) {
    return this.authService.resetPassword(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
