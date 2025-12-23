import mongoose, { Schema, Document, Model } from 'mongoose';
import type { BackupStatus } from '@/domain/backup/entities/DatabaseBackup';

export interface IDatabaseBackupDocument extends Document {
  backupId: string;
  createdAt: Date;
  filePath: string;
  sizeBytes: number;
  status: BackupStatus;
  error: string | null;
}

const DatabaseBackupSchema = new Schema<IDatabaseBackupDocument>(
  {
    backupId: { type: String, required: true, unique: true },
    filePath: { type: String, required: true },
    sizeBytes: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, enum: ['completed', 'failed'] },
    error: { type: String, default: null },
  },
  { timestamps: true }
);

DatabaseBackupSchema.index({ createdAt: -1 });
DatabaseBackupSchema.index({ status: 1 });

export const DatabaseBackupModel: Model<IDatabaseBackupDocument> =
  mongoose.models.DatabaseBackup ||
  mongoose.model<IDatabaseBackupDocument>(
    'DatabaseBackup',
    DatabaseBackupSchema
  );
