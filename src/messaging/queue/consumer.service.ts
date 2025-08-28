// import { InternalNotificationDto } from './../dtos/notification.dto';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { MessagingService } from '../messaging.service';
import { ConfigService } from '@nestjs/config';
import { EmailDto } from '../dto/message.dto';
// import { Chat } from 'src/schemas/chat.schema';
// import { ChatService } from 'src/services/chat/chat.service';
// import { ChatContact } from 'src/schemas/chat-contact.schema';
// import { ChatContactService } from 'src/services/chat/chat-contact.service';
// import { ChatUpdateDto } from 'src/dtos/chat.dto';
// import { NotificationCategory, StateStatus } from 'src/enums';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/schemas/user.schema';
// import { Repository } from 'typeorm';
// import { ProducerService } from './producer.service';
// import * as NodeCache from 'node-cache';



@Processor(new ConfigService().get<string>('BULL_EMAIL_QUEUE') ?? 'default_email_queue')
export class EmailMessagesConsumer {
  constructor(
    private readonly messagingService: MessagingService,
    private readonly configService: ConfigService,
  ) { }

  @Process('email-job')
  async handleTranscode(job: Job) {
    console.log('Email consumer consumed request...', job);
    const email = job.data as EmailDto;
    await this.messagingService.sendEmailAsync(email);
    console.log('completed!!');
  }
}
