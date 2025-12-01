import mongoose, { Schema, Document } from 'mongoose';

export interface IPageContent extends Document {
  menuItemId: mongoose.Types.ObjectId;
  content: string;
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
