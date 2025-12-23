import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBackupConfigurationDocument extends Document {
  enabled: boolean;
  scheduledHour: number;
  retentionCount: number;
  timezone: string;
  lastBackupAt: Date | null;
}

const BackupConfigurationSchema = new Schema<IBackupConfigurationDocument>(
  {
    enabled: { type: Boolean, required: true, default: false },
    scheduledHour: {
      type: Number,
      required: true,
      default: 3,
      min: 0,
      max: 23,
    },
    retentionCount: {
      type: Number,
      required: true,
      default: 7,
      min: 1,
      max: 30,
    },
    timezone: { type: String, required: true, default: 'Europe/Paris' },
    lastBackupAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const BackupConfigurationModel: Model<IBackupConfigurationDocument> =
  mongoose.models.BackupConfiguration ||
  mongoose.model<IBackupConfigurationDocument>(
    'BackupConfiguration',
    BackupConfigurationSchema
  );
