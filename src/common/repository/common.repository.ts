import {
  Model,
  FilterQuery,
  QueryOptions,
  Document,
  PopulateOptions,
  PipelineStage,
  UpdateQuery,
} from 'mongoose';

export class CommonRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const createdEntity = new this.model(data);
    return await createdEntity.save();
  }

  async findById(id: string, option?: QueryOptions): Promise<T | null> {
    return this.model.findById(id, option);
  }

  async findByCondition(
    filter: FilterQuery<T>,
    field?: Record<string, App.Any> | null,
    option?: QueryOptions | null,
  ): Promise<T> {
    return this.model.findOne(filter, field, option);
  }

  async getByCondition(
    filter: FilterQuery<T>,
    field?: Record<string, App.Any> | null,
    option?: QueryOptions | null,
    populate?: PopulateOptions | null,
  ): Promise<T[]> {
    return this.model.find(filter, field, option).populate(populate);
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  async aggregate(option: PipelineStage[]): Promise<T[]> {
    return this.model.aggregate(option);
  }

  async populate(result: T[], option: PopulateOptions): Promise<T[]> {
    return await this.model.populate(result, option);
  }

  async deleteOne(id: string) {
    return this.model.deleteOne({ _id: id } as FilterQuery<T>);
  }

  async deleteMany(id: string[]) {
    return this.model.deleteMany({ _id: { $in: id } } as FilterQuery<T>);
  }

  async deleteByCondition(filter: FilterQuery<T>) {
    return this.model.deleteMany(filter);
  }

  async findByConditionAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<T> {
    return this.model.findOneAndUpdate(filter, update);
  }

  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    option?: QueryOptions | null,
  ) {
    return this.model.updateMany(filter, update, option);
  }

  async findByIdAndUpdate(id: string, update: UpdateQuery<T>): Promise<T> {
    return this.model.findByIdAndUpdate(id, update);
  }
}
