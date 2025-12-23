import { DatabaseBackup } from '../entities/DatabaseBackup';

/**
 * Port for database backup operations.
 */
export interface IDatabaseBackupService {
  /**
   * Create a new database backup.
   * Returns the created backup record.
   */
  createBackup(): Promise<DatabaseBackup>;

  /**
   * Restore the database from a backup.
   * @param backup The backup to restore from
   */
  restoreBackup(backup: DatabaseBackup): Promise<void>;

  /**
   * Delete a backup and its associated file.
   * @param backup The backup to delete
   */
  deleteBackup(backup: DatabaseBackup): Promise<void>;

  /**
   * List all available backups, sorted by creation date (most recent first).
   */
  listBackups(): Promise<DatabaseBackup[]>;

  /**
   * Get a backup by its ID.
   * @param id The backup ID
   */
  getBackupById(id: string): Promise<DatabaseBackup | null>;

  /**
   * Clean up old backups to enforce retention limit.
   * @param retentionCount Maximum number of backups to keep
   */
  enforceRetentionLimit(retentionCount: number): Promise<void>;
}
