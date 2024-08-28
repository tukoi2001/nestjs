import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../users/user.module';
import { OTPModule } from '../otp/otp.module';
import { OtpService } from '../otp/otp.service';
import { UsersController } from '../users/user.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './accessToken.strategy';

@Module({
  imports: [JwtModule.register({}), UserModule, OTPModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    ConfigService,
    UsersController,
    OtpService,
  ],
})
export class AuthModule {}
