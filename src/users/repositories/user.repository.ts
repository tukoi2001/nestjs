import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonRepository } from 'src/common/repository/common.repository';
import { UserDocument } from '../models/user.model';

@Injectable()
export class UserRepository extends CommonRepository<UserDocument> {
  constructor(
    @InjectModel('Product')
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
