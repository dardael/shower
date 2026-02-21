import mongoose, { Schema, Document } from 'mongoose';

export interface IPageContent extends Document {
  menuItemId: mongoose.Types.ObjectId;
  content: string;
  heroMediaUrl: string | null;
  heroMediaType: 'image' | 'video' | null;
  heroText: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const PageContentSchema = new Schema<IPageContent>(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'MenuItem',
    },
    content: {
      type: String,
      required: true,
      maxlength: 100000,
    },
    heroMediaUrl: {
      type: String,
      default: null,
    },
    heroMediaType: {
      type: String,
      enum: ['image', 'video', null],
      default: null,
    },
    heroText: {
      type: String,
      default: null,
      maxlength: 50000,
    },
  },
  {
    collection: 'pageContents',
    timestamps: true,
  }
);

PageContentSchema.index({ menuItemId: 1 }, { unique: true });

export const PageContentModel =
  mongoose.models.PageContent ||
  mongoose.model<IPageContent>('PageContent', PageContentSchema);
