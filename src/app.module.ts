import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
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
import { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SmeModule } from './sme/sme.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: [
        `${process.cwd()}/.env.${process.env.NODE_ENV}`,
      ],
     }),
    TypeOrmModule.forRoot(dataSourceOptions),
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
    CloudinaryModule,
    SmeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
