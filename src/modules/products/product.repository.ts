import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonRepository } from 'src/common/repository/common.repository';
import { Product } from './product.model';

@Injectable()
export class ProductRepository extends CommonRepository<Product> {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {
    super(productModel);
  }
}
