import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { NdaModule } from './nda/nda.module';
import { ProfileModule } from './profile/profile.module';
import { MatchingModule } from './matching/matching.module';
import { EngagementModule } from './engagement/engagement.module';
import { MessagingModule } from './messaging/messaging.module';
import { VideoIntegrationModule } from './videointegration/videointegration.module';
import { TaskBoardModule } from './taskboard/taskboard.module';
import { TimeTrackingModule } from './timetracking/timetracking.module';
import { BillingModule } from './billing/billing.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AdminModule } from './admin/admin.module';
import { NotificationModule } from './notification/notification.module';
import { dataSourceOptions } from './db/data-source';
import { UsersModule } from './users/users.module';
import { SmeModule } from './sme/sme.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { SeedModule } from './seed/seed.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { BullModule } from '@nestjs/bull';
// import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: parseInt(configService.get<string>('REDIS_PORT')!),
          },
          ttl: 15 * 60 * 1000, // 15 minutes in milliseconds
        });
        console.log('Redis cache store initialized');
        return {
          store: () => store,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    NdaModule,
    ProfileModule,
    MatchingModule,
    EngagementModule,
    MessagingModule,
    VideoIntegrationModule,
    TaskBoardModule,
    TimeTrackingModule,
    BillingModule,
    FeedbackModule,
    AdminModule,
    NotificationModule,
    UsersModule,
    SmeModule,
    SeedModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
