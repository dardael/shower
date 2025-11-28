import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  text: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export const MenuItemSchema = new Schema<IMenuItem>(
  {
    text: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    position: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    collection: 'menuItems',
    timestamps: true,
  }
);

MenuItemSchema.index({ position: 1 });

export const MenuItemModel =
  mongoose.models.MenuItem ||
  mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
