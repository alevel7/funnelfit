// import { InternalNotificationDto } from './../dtos/notification.dto';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { MessagingService } from '../messaging.service';
import { ConfigService } from '@nestjs/config';
import { EmailDto } from '../dto/message.dto';
// import { ChatService } from 'src/services/chat/chat.service';
// import { ChatContact } from 'src/schemas/chat-contact.schema';
// import { ChatContactService } from 'src/services/chat/chat-contact.service';
// import { ChatUpdateDto } from 'src/dtos/chat.dto';
// import { NotificationCategory, StateStatus } from 'src/enums';
// import { InjectRepository } from '@nestjs/typeorm';
// import * as NodeCache from 'node-cache';



@Processor('email')
export class EmailMessagesConsumer {
  constructor(
    private readonly messagingService: MessagingService,
    private readonly configService: ConfigService,
  ) { }

  @Process('email-job')
  async handleTranscode(job: Job) {
    const email = job.data as EmailDto;
    await this.messagingService.sendEmailAsync(email);
  }
}
