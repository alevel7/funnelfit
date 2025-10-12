import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MessagingService } from './messaging.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ProducerService } from './queue/producer.service';
import { EmailMessagesConsumer } from './queue/consumer.service';
import { BullModule } from '@nestjs/bull';

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
          dir: join(__dirname, '../../templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configservice: ConfigService) => {
        console.log("connecting to redis server")
        return {
          redis: {
            host: configservice.get('REDIS_HOST'),
            port: configservice.get('REDIS_PORT'),
            username: configservice.get('REDIS_USERNAME'),
            password: configservice.get('REDIS_PASSWORD'),
          },
        }
      },
      inject: [ConfigService],
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
  exports: [MessagingService, ProducerService, BullModule],
})
export class MessagingModule { }
