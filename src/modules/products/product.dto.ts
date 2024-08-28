import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
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
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;
}
