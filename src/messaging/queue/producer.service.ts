import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ProducerService {
  constructor(
    @InjectQueue(process.env.BULL_EMAIL_QUEUE)
    private readonly emailQueue: Queue,
  ) { }

  // async publishChat(request: Chat) {
  //   console.log('new chat message....');
  //   await this.chatQueue.add('chat-job', request);
  // }
  // async publishChatUpdate(request: ChatUpdateDto) {
  //   console.log('updating chat status....');
  //   await this.chatQueue.add('chat-update-job', request);
  // }
  // async publishSMS(request: SMSDto) {
  //   console.log('sending sms....',);
  //   await this.smsQueue.add('sms-job', request);
  // }
  async publishEmail(request: EmailDto) {
    console.log('sending email....');
    await this.emailQueue.add('email-job', request);
  }
  // async publishNotification(request: NotificationDto) {
  //   console.log('pushing notification....', request.subject);
  //   await this.notificationQueue.add('notification-job', request);
  // }
  // async publishInternalNotification(request: InternalNotificationDto) {
  //   console.log('pushing admin notification....', request.subject);
  //   await this.internalNotificationQueue.add('internal-notification-job', request);
  // }
  // async publishAnalytic(user: User) {
  //   console.log('pushing new analytic....');
  //   await this.userAnalyticQueue.add('user-analytic-job', user);
  // }
}
