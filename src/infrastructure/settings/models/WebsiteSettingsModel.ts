import mongoose, { Schema, Document } from 'mongoose';
import { SocialNetworkSchema, type ISocialNetwork } from './SocialNetworkModel';
import { THEME_COLOR_PALETTE } from '@/domain/settings/constants/ThemeColorPalette';

export interface IIconMetadata {
  filename: string;
  originalName: string;
  size: number;
  format: string;
  mimeType: string;
  uploadedAt: Date;
}

export interface IWebsiteSettings extends Document {
  key: string;
  name: string;
  icon: {
    url: string;
    metadata: IIconMetadata;
  } | null;
  socialNetworks: ISocialNetwork[];
  themeColor: string;
}

const IconMetadataSchema = new Schema<IIconMetadata>(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 1,
      max: 2 * 1024 * 1024, // 2MB max
    },
    format: {
      type: String,
      required: true,
      enum: ['ico', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'],
    },
    mimeType: {
      type: String,
      required: true,
      enum: [
        'image/x-icon',
        'image/vnd.microsoft.icon',
        'image/png',
        'image/jpeg',
        'image/svg+xml',
        'image/gif',
        'image/webp',
      ],
    },
    uploadedAt: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: 'Upload date cannot be in the future',
      },
    },
  },
  { _id: false }
);

const IconSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => {
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Icon URL must be a valid URL',
      },
    },
    metadata: {
      type: IconMetadataSchema,
      required: true,
    },
  },
  { _id: false }
);

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
    icon: {
      type: IconSchema,
      default: null,
    },
    socialNetworks: {
      type: [SocialNetworkSchema],
      default: [],
    },
    themeColor: {
      type: String,
      required: true,
      default: 'blue',
      enum: THEME_COLOR_PALETTE,
      validate: {
        validator: (value: string) => {
          return THEME_COLOR_PALETTE.includes(
            value as (typeof THEME_COLOR_PALETTE)[number]
          );
        },
        message: `Theme color must be one of: ${THEME_COLOR_PALETTE.join(', ')}`,
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
