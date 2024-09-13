import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessTokenStrategy } from 'src/modules/auth/accessToken.strategy';
import { UserSchema, User } from './user.model';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
      }),
    }),
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AccessTokenStrategy],
  exports: [UsersService],
})
export class UserModule {}
