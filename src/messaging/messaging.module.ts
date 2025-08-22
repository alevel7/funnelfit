import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailMessagesConsumer, MessagingService } from './messaging.service';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ProducerService } from './queue/producer.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get('MAIL_USERNAME'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@funnelfit.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),
    BullModule.registerQueueAsync({
      name: 'email',
    }),
  ],
  controllers: [],
  providers: [
    MessagingService,
    ProducerService,
    EmailMessagesConsumer
  ],
  exports: [MessagingService, MailerModule, BullModule],
})
export class MessagingModule { }
