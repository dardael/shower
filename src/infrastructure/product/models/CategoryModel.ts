import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategoryDocument extends Document {
  _id: string;
  name: string;
  description: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, default: '', maxlength: 2000 },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    _id: false,
  }
);

CategorySchema.index({ name: 'text', description: 'text' });

export const CategoryModel: Model<ICategoryDocument> =
  mongoose.models.Category ||
  mongoose.model<ICategoryDocument>('Category', CategorySchema);
