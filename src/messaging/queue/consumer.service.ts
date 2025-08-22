// import { InternalNotificationDto } from './../dtos/notification.dto';
// import { Job } from 'bull';
// import { Process, Processor } from '@nestjs/bull';
// import { Chat } from 'src/schemas/chat.schema';
// import { ChatService } from 'src/services/chat/chat.service';
// import { EmailDto, NotificationDto, SMSDto } from 'src/dtos/notification.dto';
// import { MessagingService } from 'src/services/messaging/messaging.service';
// import { ChatContact } from 'src/schemas/chat-contact.schema';
// import { ChatContactService } from 'src/services/chat/chat-contact.service';
// import { ChatUpdateDto } from 'src/dtos/chat.dto';
// import { NotificationCategory, StateStatus } from 'src/enums';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/schemas/user.schema';
// import { Repository } from 'typeorm';
// import { ProducerService } from './producer.service';
// import * as NodeCache from 'node-cache';

// @Processor(process.env.BULL_USER_ANALYTIC_QUEUE)
export class UserAnalyticMessagesConsumer {
  constructor(
   ) { }
  // @Process('user-analytic-job')
  // async handleTranscode(job: Job) {
  //   console.log('User analytic consumer consumed request...');
  //   const user = job.data as User;
  //   //record users analytics
  //   var whitelistedKeys = process.env.USER_ANALYTICS as any;
  //   if (whitelistedKeys)
  //     whitelistedKeys = whitelistedKeys.split(",");
  //   else
  //     whitelistedKeys = [];
    
  //   console.log('User analytic recorded!!');
  // }
}


// @Processor(process.env.BULL_EMAIL_QUEUE)
// export class EmailMessagesConsumer {
//   constructor(private readonly messagingService: MessagingService) { }
//   @Process('email-job')
//   async handleTranscode(job: Job) {
//     console.log('Email consumer consumed request...');
//     const email = job.data as EmailDto;
//     await this.messagingService.sendEmail(email);
//     console.log('completed!!');
//   }
// }

// @Processor(process.env.BULL_SMS_QUEUE)
// export class SMSMessagesConsumer {
//   constructor(private readonly messagingService: MessagingService) { }
//   @Process('sms-job')
//   async handleTranscode(job: Job) {
//     console.log('SMS consumer consumed request...');
//     const sms = job.data as SMSDto;
//     await this.messagingService.sendSMS(sms);
//   }
// }

// @Processor(process.env.BULL_NOTIFICATION_QUEUE)
// export class NotificationMessagesConsumer {
//   constructor(
//     private readonly messagingService: MessagingService,
//     @InjectRepository(User) private userRepo: Repository<User>,
//   ) { }

//   @Process('notification-job')
//   async handleTranscode(job: Job) {
//     console.log('Notification consumer consumed request...');
//     if (job.data) {
//       const notification = job.data as NotificationDto;
//       await this.messagingService.sendNotification(notification);
//     }
//   }
// }


// @Processor(process.env.BULL_INTERNAL_NOTIFICATION_QUEUE)
// export class InternalNotificationMessagesConsumer {
//   constructor(
//     private readonly messagingService: MessagingService,
//   ) { }

//   @Process('internal-notification-job')
//   async handleTranscode(job: Job) {
//     console.log('Internal notification consumer consumed request...');
//     if (job.data) {
//       const notification = job.data as InternalNotificationDto;
//       await this.messagingService.sendInternalNotification(notification);
//     }
//   }
// }

// @Processor(process.env.BULL_CHAT_QUEUE)
// export class ChatMessagesConsumer {
//   cache = new NodeCache();
//   constructor(
//     private readonly chatService: ChatService,
//     private readonly chatContactService: ChatContactService,
//     private readonly queueProducerService: ProducerService,
//   ) { }
//   @Process('chat-job')
//   async handleTransvideo(job: Job) {
//     const chat = job.data as Chat;
//     console.log('Chat messaged arrived for saving..')

//     const saveChatResponse = await this.chatService.saveChat(chat);
//     if (saveChatResponse) {
    
//       let lastMessage = chat.message;
//       const chatContact = {
//         lastMessage: lastMessage,
//         lastMessageId: chat.id,
//         senderName: chat.senderName,
//         senderEmail: chat.senderEmail,
//         senderDp: chat.senderDp,
//         recipientName: chat.recipientName,
//         recipientEmail: chat.recipientEmail,
//         recipientDp: chat.recipientDp,
//         status: StateStatus.UNSEEN,
//       } as ChatContact;


//       const notification = {
//         from: {
//           name: chatContact.senderName,
//           emailAddress: chatContact.senderEmail,
//           dp: chatContact.senderDp,
//         },
//         to: {
//           name: chatContact.recipientName,
//           emailAddress: chatContact.recipientEmail,
//           dp: chatContact.recipientDp,
//         },
//         subject: `New message`,
//         body: `You got new message from ${chat.senderName}`,
//         category: NotificationCategory.CHAT,
//         enableEmail: false,
//         enableSMS: false,
//         enableInApp: true,
//       } as unknown as NotificationDto;

//       this.queueProducerService.publishNotification(notification);
//       await this.chatContactService.saveChatContact(chatContact);
//     }
//   }
// }

// @Processor(process.env.BULL_CHAT_UPDATE_QUEUE)
// export class ChatMessagesUpdateConsumer {
//   constructor(
//     private readonly chatContactService: ChatContactService,
//   ) { }
//   @Process('chat-update-job')
//   async handleTransvideo(job: Job) {
//     console.log('Chat update consumer consumed request...');
//     const request = job.data as ChatUpdateDto;
//     await this.chatContactService.updateChatContact(request);
//   }
// }
