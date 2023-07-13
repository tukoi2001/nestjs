import { Schema, Document } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: String,
    title: String,
    description: String,
  },
  {
    timestamps: true,
    collection: 'products',
  },
);

export { ProductSchema };

export interface Product extends Document {
  name: string;
  title: string;
  description: string;
}
