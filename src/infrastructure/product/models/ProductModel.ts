import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductDocument extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  displayOrder: number;
  categoryIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, maxlength: 200 },
    description: { type: String, default: '', maxlength: 5000 },
    price: { type: Number, required: true, min: 0.01 },
    imageUrl: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    categoryIds: { type: [String], default: [] },
  },
  {
    timestamps: true,
    _id: false,
  }
);

ProductSchema.index({ displayOrder: 1 });
ProductSchema.index({ categoryIds: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

export const ProductModel: Model<IProductDocument> =
  mongoose.models.Product ||
  mongoose.model<IProductDocument>('Product', ProductSchema);
