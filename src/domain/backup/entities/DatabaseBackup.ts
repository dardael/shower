/**
 * DatabaseBackup entity
 * Represents a single database backup record.
 */
export type BackupStatus = 'completed' | 'failed';

export interface DatabaseBackupData {
  id: string;
  createdAt: Date;
  filePath: string;
  sizeBytes: number;
  status: BackupStatus;
  error: string | null;
}

export class DatabaseBackup {
  private readonly _id: string;
  private readonly _createdAt: Date;
  private readonly _filePath: string;
  private readonly _sizeBytes: number;
  private readonly _status: BackupStatus;
  private readonly _error: string | null;

  private constructor(data: DatabaseBackupData) {
    this._id = data.id;
    this._createdAt = data.createdAt;
    this._filePath = data.filePath;
    this._sizeBytes = data.sizeBytes;
    this._status = data.status;
    this._error = data.error;
  }

  static create(data: DatabaseBackupData): DatabaseBackup {
    DatabaseBackup.validateId(data.id);
    DatabaseBackup.validateFilePath(data.filePath);
    DatabaseBackup.validateSizeBytes(data.sizeBytes);

    return new DatabaseBackup(data);
  }

  private static validateId(id: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('id must be a valid UUID v4');
    }
  }

  private static validateFilePath(filePath: string): void {
    if (!filePath || filePath.trim() === '') {
      throw new Error('filePath must be a non-empty string');
    }
  }

  private static validateSizeBytes(sizeBytes: number): void {
    if (!Number.isInteger(sizeBytes) || sizeBytes < 0) {
      throw new Error('sizeBytes must be a non-negative integer');
    }
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get filePath(): string {
    return this._filePath;
  }

  get sizeBytes(): number {
    return this._sizeBytes;
  }

  get status(): BackupStatus {
    return this._status;
  }

  get error(): string | null {
    return this._error;
  }

  isRestorable(): boolean {
    return this._status === 'completed';
  }

  toData(): DatabaseBackupData {
    return {
      id: this._id,
      createdAt: this._createdAt,
      filePath: this._filePath,
      sizeBytes: this._sizeBytes,
      status: this._status,
      error: this._error,
    };
  }

  toPublicData(): Omit<DatabaseBackupData, 'filePath' | 'error'> {
    return {
      id: this._id,
      createdAt: this._createdAt,
      sizeBytes: this._sizeBytes,
      status: this._status,
    };
  }
}
