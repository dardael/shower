import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailLogDocument extends Document {
  logId: string;
  orderId: string;
  type: 'admin' | 'purchaser';
  recipient: string;
  subject: string;
  status: 'sent' | 'failed';
  errorMessage: string | null;
  sentAt: Date;
}

const EmailLogSchema = new Schema<IEmailLogDocument>(
  {
    logId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true, index: true },
    type: { type: String, required: true, enum: ['admin', 'purchaser'] },
    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['sent', 'failed'],
      index: true,
    },
    errorMessage: { type: String, default: null },
    sentAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

export const EmailLogModel =
  mongoose.models.EmailLog ||
  mongoose.model<IEmailLogDocument>('EmailLog', EmailLogSchema);
