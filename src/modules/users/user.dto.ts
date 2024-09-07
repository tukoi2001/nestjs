import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  Length,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'First name is required',
    example: 'Doe',
  })
  @IsNotEmpty({ message: 'First name is required.' })
  @IsString({ message: 'First name must be a string.' })
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters.' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'First name can only contain letters and spaces.',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name is required',
    example: 'John',
  })
  @IsNotEmpty({ message: 'Last name is required.' })
  @IsString({ message: 'Last name must be a string.' })
  @Length(1, 50, { message: 'Last name must be between 1 and 50 characters.' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Last name can only contain letters and spaces.',
  })
  lastName: string;

  @ApiProperty({
    description: 'Phone number is required',
    example: '0345678912',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s-]{3,15}$/, {
    message:
      'Invalid phone number. It must be a valid international phone number.',
  })
  phoneNumber: string;

  @ApiProperty({
    type: 'email',
    description: 'The email of the user',
    example: 'example@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @ApiProperty({
    description:
      'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    example: 'Example@123',
  })
  @IsNotEmpty({ message: 'Password is required.' })
  @Length(8, 100, { message: 'Password must be at least 8 characters long.' })
  password: string;

  @ApiPropertyOptional({
    description: 'The address of the user',
    example: 'Da Nang',
  })
  @IsString({ message: 'Address must be a string.' })
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'The role of the user',
    example: 'user',
  })
  @IsString({ message: 'Role must be a string.' })
  @IsOptional()
  role?: string;

  @IsOptional()
  refreshToken?: string | null;

  @IsOptional()
  resetToken?: string | null;

  @IsOptional()
  otp?: string | null;

  @IsOptional()
  otpExpires?: Date | null;

  @IsOptional()
  isActive?: boolean;
}
