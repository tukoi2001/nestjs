import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from '../models/user.model';
import { UsersService } from '../services/user.service';
// import { UserRepository } from '../repositories/user.repository';
import { UsersController } from '../controllers/user.controller';
import { AccessTokenStrategy } from 'src/auth/strategies';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AccessTokenStrategy],
  exports: [UsersService],
})
export class UserModule {}
