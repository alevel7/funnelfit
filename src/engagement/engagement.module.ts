import { Module } from '@nestjs/common';
import { EngagementController } from './engagement.controller';
import { EngagementService } from './engagement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRequest } from 'http';
import { CFOProfile } from 'src/entities/cfo-profile.entity';
import { CfoRequest } from 'src/entities/cfo-request.entity';
import { SMEProfile } from 'src/entities/sme-profile.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { MessagingModule } from 'src/messaging/messaging.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([
        SMEProfile,
        User,
        CFOProfile,
        CfoRequest,
        ClientRequest,
        Task
      ]),
      MessagingModule,
    ],
  controllers: [EngagementController],
  providers: [EngagementService],
})
export class EngagementModule {}
