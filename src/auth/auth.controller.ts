import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { ValidateOtpDto } from './dto/validateOtp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.', type: User })
  async register(@Body() dto: RegisterDto){
    return this.authService.register(dto);
  }

  @Post('validate-otp')
  async validateOtp(@Body() dto: ValidateOtpDto) {
    return this.authService.validateOtp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
