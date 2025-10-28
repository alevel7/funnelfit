import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CFOProfile } from 'src/entities/cfo-profile.entity';

@Module({
  providers: [SeedService],
  imports: [TypeOrmModule.forFeature([User, CFOProfile])],
  exports: [SeedService],
})
export class SeedModule {}
