import { Module } from '@nestjs/common';
import { ProductsController } from '../controllers/products.controller';
import { ProductsService } from '../services/products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../models/product.model';
import { ProductRepository } from '../repositories/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository],
})
export class ProductModule {}
