import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
      request.user = payload;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException(
          'Session has expired. Please log in again.',
          440,
        );
      }
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
