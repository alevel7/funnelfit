import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OnboardingModule } from './onboarding/onboarding.module';
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
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Application } from './entities/application.entity';
import { Engagement } from './entities/engagement.entity';
import { NDA } from './entities/nda.entity';
import { Feedback } from './entities/feedback.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Role, Application, Engagement, NDA, Feedback],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    UserModule,
    OnboardingModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
