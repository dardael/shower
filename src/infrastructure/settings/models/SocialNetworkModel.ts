import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialNetwork extends Document {
  type: string;
  url: string;
  label: string;
  enabled: boolean;
}

export const SocialNetworkSchema = new Schema<ISocialNetwork>(
  {
    type: {
      type: String,
      required: true,
      enum: ['instagram', 'facebook', 'linkedin', 'email', 'phone'],
    },
    url: {
      type: String,
      required: function (this: ISocialNetwork) {
        return this.enabled; // Only required when enabled is true
      },
      default: '',
      validate: {
        validator: function (this: ISocialNetwork, value: string) {
          // Empty URLs are allowed (disabled networks)
          if (value.trim() === '') {
            return true;
          }

          // URL validation based on type
          if (this.type === 'email') {
            return /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          }
          if (this.type === 'phone') {
            return /^tel:[\d\s\-\+\(\)]+$/.test(value);
          }
          // For social media networks, validate URL format
          try {
            new URL(value);
            return /^https?:\/\//.test(value);
          } catch {
            return false;
          }
        },
        message: function (this: ISocialNetwork) {
          if (this.type === 'email') {
            return 'Invalid email format. Expected: mailto:email@example.com';
          }
          if (this.type === 'phone') {
            return 'Invalid phone format. Expected: tel:+1234567890';
          }
          return 'Invalid URL format. Expected: https://...';
        },
      },
    },
    label: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
      validate: {
        validator: function (value: string) {
          // No HTML special characters
          return !/<|>|&|"|'/.test(value);
        },
        message: 'Label contains invalid characters',
      },
    },
    enabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'socialNetworks',
    timestamps: false, // No timestamps for social networks
  }
);

export const SocialNetworkModel =
  mongoose.models.SocialNetwork ||
  mongoose.model<ISocialNetwork>('SocialNetwork', SocialNetworkSchema);
