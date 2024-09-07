import { IsNotEmpty, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({
    type: 'email',
    description: 'The email of the user',
    example: 'example@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;
}

export class SignInDto extends EmailDto {
  @ApiProperty({
    description:
      'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    example: 'Example@123',
  })
  @IsNotEmpty({ message: 'Password is required.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Please provide a valid refresh token.',
    example: 'ey********************************',
  })
  @IsNotEmpty({ message: 'Refresh token is required.' })
  refreshToken: string;
}

export class VerifyOTPDto extends EmailDto {
  @ApiProperty({
    description: 'Please provide a valid OTP.',
    example: 'Example@123',
  })
  @IsNotEmpty({ message: 'OTP is required.' })
  otp: string;
}

export class ResendOTPDto extends EmailDto {}

export class ForgotPasswordDto extends EmailDto {}

export class ResetPasswordDto {
  @ApiProperty({
    description:
      'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    example: 'Example@123',
  })
  @IsNotEmpty({ message: 'Password is required.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  newPassword: string;

  @ApiProperty({
    description: 'Please provide a valid Token.',
    example: 'ey********************************',
  })
  @IsNotEmpty({ message: 'Token is required.' })
  token: string;
}
