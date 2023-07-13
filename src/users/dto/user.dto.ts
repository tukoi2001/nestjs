import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'Product title is not empty',
  })
  @MinLength(10, {
    message: 'Product title is too short',
  })
  @MaxLength(50, {
    message: 'Product title is too long',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty({
    message: 'Product title is not empty',
  })
  @MinLength(10, {
    message: 'Product title is too short',
  })
  @MaxLength(50, {
    message: 'Product title is too long',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty({
    message: 'Product title is not empty',
  })
  @MinLength(10, {
    message: 'Product title is too short',
  })
  @MaxLength(50, {
    message: 'Product title is too long',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty({
    message: 'Product title is not empty',
  })
  @MinLength(10, {
    message: 'Product title is too short',
  })
  @MaxLength(50, {
    message: 'Product title is too long',
  })
  address: string;

  @IsEmail()
  @IsNotEmpty({
    message: 'Product title is not empty',
  })
  email: string;

  @IsNotEmpty({
    message: 'Product title is not empty',
  })
  password: string;

  role: string;
  refreshToken: string | null;
}

export class UpdateUserDto {
  refreshToken: string | null;
}
