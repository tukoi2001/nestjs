import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { ExpiredTokenFilter } from 'src/filters/expired-token.filter';
import MongooseClassSerializerInterceptor from 'src/interceptor/mongooseClassSerializer.interceptor';
import { CreateUserDto as SignUpDto } from '../users/user.dto';
import { User, UserDocument } from '../users/user.model';
import { AuthService } from './auth.service';
import {
  SignInDto,
  RefreshTokenDto,
  VerifyOTPDto,
  ResendOTPDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 3600000 } }) // 1 hour (spam sign-up)
  @Post('sign-up')
  @ApiBody({ type: SignUpDto })
  signUp(@Body() createUserDto: SignUpDto): Promise<Auth.SignUpResponse> {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(ThrottlerGuard)
  @Post('sign-in')
  @ApiBody({ type: SignInDto })
  signIn(@Body() data: SignInDto): Promise<Auth.SignInResponse> {
    return this.authService.signIn(data);
  }

  @UseFilters(ExpiredTokenFilter)
  @ApiBearerAuth('token')
  @UseGuards(AccessTokenGuard, ThrottlerGuard)
  @Get('sign-out')
  signOut(@Req() req: Request): Promise<App.BaseResponse> {
    const userId = req.user['sub'];
    return this.authService.signOut(userId);
  }

  @UseGuards(RefreshTokenGuard, ThrottlerGuard)
  @Post('refresh-token')
  @ApiBody({ type: RefreshTokenDto })
  refreshToken(
    @Req() req: Request,
    @Body() { refreshToken }: RefreshTokenDto,
  ): Promise<Auth.TokenResponse> {
    const userId = req.user['sub'];
    return this.authService.refreshToken(userId, refreshToken);
  }

  @UseFilters(ExpiredTokenFilter)
  @ApiBearerAuth('token')
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
  @ApiBody({ type: VerifyOTPDto })
  async verifyOtp(@Body() { email, otp }: VerifyOTPDto) {
    return this.authService.verifyOtp(email, otp);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 900000 } }) // 15 minutes
  @Post('resend-otp')
  @ApiBody({ type: ResendOTPDto })
  async resendOtp(@Body() { email }: ResendOTPDto) {
    return this.authService.resendOtp(email);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 900000 } }) // 15 minutes
  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.authService.forgotPassword(email);
  }

  @UseGuards(ThrottlerGuard)
  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() { token, newPassword }: ResetPasswordDto) {
    return this.authService.resetPassword(token, newPassword);
  }
}
