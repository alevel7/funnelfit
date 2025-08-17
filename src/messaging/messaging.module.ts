import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MessagingService } from './messaging.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'your_email@example.com',
          pass: 'your_password',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [],
  providers: [MessagingService],
})
export class MessagingModule {}
