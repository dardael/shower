import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsiteSettings extends Document {
  key: string;
  name: string;
}

const WebsiteSettingsSchema = new Schema<IWebsiteSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      default: 'Shower',
      maxlength: 50,
      validate: {
        validator: (value: string) => {
          // No HTML special characters
          return !/<|>|&|"|'/.test(value);
        },
        message: 'Website name contains invalid characters',
      },
    },
  },
  {
    collection: 'websiteSettings',
    timestamps: false, // No timestamps for settings
  }
);

export const WebsiteSettingsModel =
  mongoose.models.WebsiteSettings ||
  mongoose.model<IWebsiteSettings>('WebsiteSettings', WebsiteSettingsSchema);
