import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonRepository } from 'src/common/repository/common.repository';
import { UserDocument, User } from './user.model';

@Injectable()
export class UserRepository extends CommonRepository<UserDocument> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
