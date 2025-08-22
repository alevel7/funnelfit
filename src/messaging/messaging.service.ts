import { Injectable } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MessagingService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async sendEmailAsync(to: string, subject: string, text: string, html?: string): Promise<void> {
    try {
      const result = await this.mailerService.sendMail({
        to,
        subject,
        text,
        html,
      });
      console.log(`Email sent to ${to}: ${result}`);
    } catch (error) {
      console.error(`Error sending email to ${to}: ${error}`);
    }
  }

  // Producer: Add email job to queue
  async queueEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    console.log(`Queuing email to ${to}: ${subject}`);
    await this.emailQueue.add('sendEmail', { to, subject, text, html });
  }


}

@Processor('email')
export class EmailMessagesConsumer {
  constructor(private readonly messagingService: MessagingService) { }
  @Process('sendEmail')
  async processEmailJob(job: Job<{ to: string; subject: string; text: string; html?: string }>): Promise<void> {
    const { to, subject, text, html } = job.data;
    await this.messagingService.sendEmailAsync(to, subject, text, html);
  }
}