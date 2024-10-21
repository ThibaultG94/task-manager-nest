import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserContact } from './entities/user-contact.entity';
import { UserBlocked } from './entities/user-blocked.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserContact, UserBlocked])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
