import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenStrategy } from 'src/modules/auth/accessToken.strategy';
import { UserSchema, User } from './user.model';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AccessTokenStrategy],
  exports: [UsersService],
})
export class UserModule {}
