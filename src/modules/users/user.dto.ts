import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  Length,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required.' })
  @IsString({ message: 'First name must be a string.' })
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters.' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'First name can only contain letters and spaces.',
  })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required.' })
  @IsString({ message: 'Last name must be a string.' })
  @Length(1, 50, { message: 'Last name must be between 1 and 50 characters.' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Last name can only contain letters and spaces.',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s-]{3,15}$/, {
    message:
      'Invalid phone number. It must be a valid international phone number.',
  })
  phoneNumber: string;

  @IsString({ message: 'Address must be a string.' })
  @IsOptional()
  address?: string;

  @IsEmail({}, { message: 'Invalid email format.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @Length(8, 100, { message: 'Password must be at least 8 characters long.' })
  password: string;

  @IsString({ message: 'Role must be a string.' })
  @IsOptional()
  role?: string;

  @IsOptional()
  refreshToken?: string | null;

  @IsOptional()
  otp?: string | null;

  @IsOptional()
  otpExpires?: Date | null;

  @IsOptional()
  isActive: boolean;
}

export class UpdateUserDto {
  refreshToken: string | null;
}
