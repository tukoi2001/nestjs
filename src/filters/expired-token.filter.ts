import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ExpiredTokenFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse();
    if (status === 440) {
      response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: 440,
        message: 'Session has expired. Please log in again.',
      });
    } else {
      response.status(status).json({
        statusCode: status,
        message: message,
      });
    }
  }
}
