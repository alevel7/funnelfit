import { Module } from '@nestjs/common';
import { SmeService } from './sme.service';
import { SmeController } from './sme.controller';
import { SMEProfile } from 'src/entities/sme-profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CFOProfile } from 'src/entities/cfo-profile.entity';
import { CfoRequest } from 'src/entities/cfo-request.entity';
import { ClientRequest } from 'src/entities/client-request.entity';
import { MessagingModule } from 'src/messaging/messaging.module';
import { Task } from 'src/entities/task.entity';

@Module({
  providers: [SmeService],
  controllers: [SmeController],
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
})
export class SmeModule {}
