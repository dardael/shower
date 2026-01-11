import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityDocument extends Document {
  name: string;
  description?: string;
  durationMinutes: number;
  color: string;
  price: number;
  requiredFields: {
    fields: string[];
    customFieldLabel?: string;
  };
  reminderSettings: {
    enabled: boolean;
    hoursBefore?: number;
  };
  minimumBookingNoticeHours: number;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivityDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    color: {
      type: String,
      required: true,
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    requiredFields: {
      fields: {
        type: [String],
        default: ['name', 'email'],
      },
      customFieldLabel: {
        type: String,
        trim: true,
      },
    },
    reminderSettings: {
      enabled: {
        type: Boolean,
        default: false,
      },
      hoursBefore: {
        type: Number,
        min: 1,
      },
    },
    minimumBookingNoticeHours: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'activities',
  }
);

ActivitySchema.index({ name: 1 });

export const ActivityModel: Model<IActivityDocument> =
  mongoose.models.Activity ||
  mongoose.model<IActivityDocument>('Activity', ActivitySchema);
