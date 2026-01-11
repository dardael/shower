import mongoose, { Schema, Document, Model } from 'mongoose';

interface IClientInfo {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  customField?: string;
}

export interface IAppointmentDocument extends Document {
  activityId: mongoose.Types.ObjectId;
  activityName: string;
  activityDurationMinutes: number;
  clientInfo: IClientInfo;
  dateTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  version: number;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClientInfoSchema = new Schema<IClientInfo>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    customField: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const AppointmentSchema = new Schema<IAppointmentDocument>(
  {
    activityId: {
      type: Schema.Types.ObjectId,
      ref: 'Activity',
      required: true,
    },
    activityName: {
      type: String,
      required: true,
      trim: true,
    },
    activityDurationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    clientInfo: {
      type: ClientInfoSchema,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    version: {
      type: Number,
      default: 1,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'appointments',
  }
);

// Indexes for efficient queries
AppointmentSchema.index({ dateTime: 1 });
AppointmentSchema.index({ activityId: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ dateTime: 1, status: 1 });
AppointmentSchema.index({ reminderSent: 1, status: 1, dateTime: 1 });

export const AppointmentModel: Model<IAppointmentDocument> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointmentDocument>('Appointment', AppointmentSchema);
