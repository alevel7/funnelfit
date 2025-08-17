import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MessagingService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async sendEmailAsync(to: string, subject: string, text: string, html?: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      text,
      html,
    });
  }

  // Producer: Add email job to queue
  async queueEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    await this.emailQueue.add('sendEmail', { to, subject, text, html });
  }

  // Consumer: Process email jobs from queue
  async processEmailJob(job: Job<{ to: string; subject: string; text: string; html?: string }>): Promise<void> {
    const { to, subject, text, html } = job.data;
    await this.sendEmailAsync(to, subject, text, html);
  }
}
