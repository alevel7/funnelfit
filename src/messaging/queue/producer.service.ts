import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { EmailDto } from '../dto/message.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProducerService {
  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('email')
    private readonly emailQueue: Queue,
  ) { }

  async publishEmail(request: EmailDto) {
    console.log('sending email....', request);
    await this.emailQueue.add('email-job', request);
  }
}
