import { Body, Controller, Get, Post, Injectable, Param } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/product.dto';

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
