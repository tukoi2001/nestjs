import { Body, Controller, Get, Post, Injectable, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './product.dto';

@ApiTags('product')
@Injectable()
@Controller('product')
export class ProductsController {
  constructor(private readonly productsServices: ProductsService) {}

  @Get()
  async getProducts(): Promise<CreateProductDto[]> {
    return await this.productsServices.getProducts();
  }

  @Post()
  async createPost(@Body() post: CreateProductDto): Promise<CreateProductDto> {
    return await this.productsServices.createProduct(post);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<CreateProductDto> {
    return await this.productsServices.getProductById(id);
  }
}
