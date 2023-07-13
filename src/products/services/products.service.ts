import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/product.dto';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProducts(): Promise<CreateProductDto[]> {
    return await this.productRepository.getByCondition({});
  }

  async createProduct(
    createProduct: CreateProductDto,
  ): Promise<CreateProductDto> {
    return await this.productRepository.create(createProduct);
  }

  async getProductById(productId: string): Promise<CreateProductDto> {
    return await this.productRepository.findById(productId);
  }
}
