import mongoose, { Schema, Document } from 'mongoose';
import { VALID_SETTING_KEY_VALUES } from '@/domain/settings/constants/SettingKeys';

export interface IWebsiteSetting extends Document {
  key: string;
  value: unknown;
}

const WebsiteSettingSchema = new Schema<IWebsiteSetting>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) => {
          // Only allow specific setting keys
          return VALID_SETTING_KEY_VALUES.includes(value);
        },
        message: 'Invalid setting key',
      },
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    collection: 'websiteSettings',
    timestamps: false, // No timestamps for settings
  }
);

export const WebsiteSettingsModel =
  mongoose.models.WebsiteSettings ||
  mongoose.model<IWebsiteSetting>('WebsiteSettings', WebsiteSettingSchema);
