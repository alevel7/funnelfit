import { Injectable } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailDto } from './dto/message.dto';

@Injectable()
export class MessagingService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async sendEmailAsync(emailDto: EmailDto): Promise<void> {
    try {
      const result = await this.mailerService.sendMail({
        to: emailDto.to,
        subject: emailDto.subject,
        template: './email.ejs',
        context: {
          subject: emailDto.subject,
          body: emailDto.body,
          toName: emailDto.toName,
        },
      });
      console.log(`Email sent to ${emailDto.to}: ${result}`);
    } catch (error) {
      console.error(`Error sending email to ${emailDto.to}: ${error}`);
    }
  }

}
