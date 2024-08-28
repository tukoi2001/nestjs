import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class OtpService {
  constructor(private readonly mailerService: MailerService) {}

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtpEmail(
    userName: string,
    email: string,
    otp: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'OTP Verification',
      template: './send-otp',
      context: { userName, otp },
    });
  }
}
