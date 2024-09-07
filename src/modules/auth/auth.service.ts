import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { pick } from 'lodash';
import { StatusCode } from 'src/enums/app';
import { UsersService } from '../users/user.service';
import { OtpService } from '../otp/otp.service';
import { CreateUserDto } from '../users/user.dto';
import { UserDocument } from '../users/user.model';
import { SignInDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
    private readonly mailerService: MailerService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<Auth.SignUpResponse> {
    const userExists = await this.usersService.checkExistUser(
      createUserDto.email,
    );
    if (userExists) {
      throw new BadRequestException('User already exists!');
    }
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
      isActive: false,
    });
    const fullName = `${newUser.lastName} ${newUser.firstName}`;
    await this.sendActivationOtp(fullName, newUser.id, newUser.email);
    const userInfo = pick(newUser, [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'createdAt',
      'updatedAt',
      'role',
      'isActive',
    ]);
    return {
      statusCode: StatusCode.Created,
      message:
        'User registered successfully. Please check your email for the OTP.',
      userInfo,
    };
  }

  async signIn(loginDto: SignInDto): Promise<Auth.SignInResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException('User does not exist!');
    }
    const passwordMatches = await argon2.verify(
      user.password,
      loginDto.password,
    );
    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect!');
    }
    const { accessToken, refreshToken } = await this.getTokens(
      user._id,
      user.email,
    );
    await this.updateRefreshToken(user._id, refreshToken);
    const userInfo = pick(user, [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'createdAt',
      'updatedAt',
      'role',
      'isActive',
    ]);
    return {
      statusCode: StatusCode.Created,
      accessToken,
      refreshToken,
      userInfo,
    };
  }

  async signOut(userId: string): Promise<App.BaseResponse> {
    await this.usersService.update(userId, {
      refreshToken: null,
    });
    return {
      statusCode: StatusCode.Created,
      message: 'Logout successfully',
    };
  }

  async getMyProfile(userId: string): Promise<Partial<UserDocument>> {
    const user = await this.usersService.findById(userId);
    return pick(user, [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'createdAt',
      'updatedAt',
      'role',
      'isActive',
    ]);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(
    userId: string,
    username: string,
  ): Promise<Auth.TokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    userId: string,
    receiveRefreshToken: string,
  ): Promise<Auth.TokenResponse> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    if (!user.refreshToken) {
      throw new ForbiddenException('Refresh token not found');
    }
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      receiveRefreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Invalid refresh token');
    }
    const { accessToken, refreshToken } = await this.getTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  async hashData(data: string): Promise<string> {
    return await argon2.hash(data);
  }

  async setOtp(userId: string, otp: string, expiresIn: number): Promise<void> {
    const otpExpires = new Date(Date.now() + expiresIn * 1000);
    await this.usersService.update(userId, {
      otpExpires,
      otp,
    });
  }

  async isValidOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist!');
    }
    if (user.isActive) {
      throw new BadRequestException('Already active user');
    }
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return false;
    }
    return true;
  }

  async activateAccount(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    await this.usersService.update(user._id, {
      isActive: true,
      otp: null,
      otpExpires: null,
    });
  }

  async sendActivationOtp(
    fullName: string,
    userId: string,
    email: string,
  ): Promise<void> {
    const otp = this.otpService.generateOtp();
    const expiresIn = 15 * 60;
    await this.setOtp(userId, otp, expiresIn);
    await this.otpService.sendOtpEmail(fullName, email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<App.BaseResponse> {
    const isValid = await this.isValidOtp(email, otp);
    if (isValid) {
      await this.activateAccount(email);
      return {
        statusCode: StatusCode.Created,
        message: 'Account activated successfully',
      };
    }
    return {
      statusCode: StatusCode.Invalid,
      message: 'Invalid OTP',
    };
  }

  async resendOtp(email: string): Promise<App.BaseResponse> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist!');
    }
    if (user.isActive) {
      throw new BadRequestException('Already active user');
    }
    const fullName = `${user.lastName} ${user.firstName}`;
    await this.sendActivationOtp(fullName, user.id, user.email);
    return {
      statusCode: StatusCode.Ok,
      message: 'New OTP sent successfully',
    };
  }

  async saveResetToken(userId: string, resetToken: string): Promise<void> {
    const hashedResetToken = await this.hashData(resetToken);
    await this.usersService.update(userId, {
      resetToken: hashedResetToken,
    });
  }

  async forgotPassword(email: string): Promise<App.BaseResponse> {
    const user = await this.usersService.findByEmail(email);
    const resetToken = await this.jwtService.signAsync(
      { sub: user.id, email },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<string>('JWT_RESET_EXPIRES'),
      },
    );
    await this.saveResetToken(user.id, resetToken);
    const clientUrl = this.configService.get<string>('RESET_PASSWORD_URL');
    const resetUrl = `${clientUrl}?token=${resetToken}`;
    const username = `${user.firstName} ${user.lastName}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset',
      template: './reset-password',
      context: { username, resetUrl },
    });
    return {
      statusCode: StatusCode.Created,
      message:
        'Reset password sent successfully! Please check your email to reset password!',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<App.BaseResponse> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    });
    const user = await this.usersService.findById(payload.sub);
    const resetTokenMatches = await argon2.verify(user.resetToken, token);
    if (!resetTokenMatches) {
      throw new ForbiddenException('Invalid reset token!');
    }
    const hashedPassword = await this.hashData(newPassword);
    await this.usersService.update(user.id, { password: hashedPassword });
    await this.usersService.update(user.id, { resetToken: null });
    return {
      statusCode: StatusCode.Created,
      message: 'Reset password successfully!',
    };
  }
}
