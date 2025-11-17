import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CFOProfile } from 'src/entities/cfo-profile.entity';
import { ClientRequest } from 'src/entities/client-request.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, CFOProfile, ClientRequest]),
    // MessagingModule
  ],
  exports: [UsersService, TypeOrmModule.forFeature([User, CFOProfile])],
})
export class UsersModule {}
