import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { UsersModule } from 'src/users/users.module';
import { MessagingModule } from 'src/messaging/messaging.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('SECRET'),
        signOptions: { expiresIn: '1d' }
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    MessagingModule,
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
