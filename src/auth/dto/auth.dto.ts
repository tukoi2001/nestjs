import { IsNotEmpty, IsEmail } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty({
    message: 'Product title is not empty',
  })
  email: string;

  @IsNotEmpty()
  password: string;
}
