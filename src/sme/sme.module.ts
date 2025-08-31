import { Module } from '@nestjs/common';
import { SmeService } from './sme.service';
import { SmeController } from './sme.controller';
import { SMEProfile } from 'src/entities/sme-profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [SmeService],
  controllers: [SmeController],
  imports: [TypeOrmModule.forFeature([SMEProfile])],
})
export class SmeModule {}
