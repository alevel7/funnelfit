import { Module } from '@nestjs/common';
import { TaskboardController } from './taskboard.controller';
import { TaskboardService } from './taskboard.service';
import { MessagingModule } from 'src/messaging/messaging.module';
import { Task } from 'src/entities/task.entity';
import { ClientRequest } from 'src/entities/client-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CFOProfile } from 'src/entities/cfo-profile.entity';
import { CfoRequest } from 'src/entities/cfo-request.entity';
import { SMEProfile } from 'src/entities/sme-profile.entity';
import { User } from 'src/entities/user.entity';

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
  controllers: [TaskboardController],
  providers: [TaskboardService],
})
export class TaskBoardModule { }
