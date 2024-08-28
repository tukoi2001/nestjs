import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import MongooseClassSerializerInterceptor from 'src/interceptor/mongooseClassSerializer.interceptor';
import { CreateUserDto } from '../users/user.dto';
import { User, UserDocument } from '../users/user.model';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 3600000 } }) // 1 hour (spam sign-up)
  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto): Promise<Auth.SignUpResponse> {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(ThrottlerGuard)
  @Post('sign-in')
  signIn(@Body() data: LoginDto): Promise<Auth.SignInResponse> {
    return this.authService.signIn(data);
  }

  @UseGuards(AccessTokenGuard, ThrottlerGuard)
  @Get('logout')
  logout(@Req() req: Request): Promise<App.BaseResponse> {
    const userId = req.user['sub'];
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard, ThrottlerGuard)
  @Post('refresh-token')
  refreshToken(
    @Req() req: Request,
    @Body() { refreshToken }: { refreshToken: string },
  ): Promise<Auth.TokenResponse> {
    const userId = req.user['sub'];
    return this.authService.refreshToken(userId, refreshToken);
  }

  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @UseGuards(AccessTokenGuard, ThrottlerGuard)
  @Get('me')
  userInfo(@Req() req: Request): Promise<Partial<UserDocument>> {
    const userId = req.user['sub'];
    return this.authService.getMyProfile(userId);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 900000 } }) // 15 minutes
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: { email: string; otp: string }) {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 900000 } }) // 15 minutes
  @Post('resend-otp')
  async resendOtp(@Body() resendOtpDto: { email: string }) {
    return this.authService.resendOtp(resendOtpDto.email);
  }
}
