/**
 * Interface for backup and restore operations during configuration import.
 * Used to create a backup before import and restore if import fails.
 */
export interface IBackupService {
  /**
   * Creates a backup of current configuration and returns a backup identifier.
   * @returns Promise resolving to backup ID or null if backup failed
   */
  createBackup(): Promise<string | null>;

  /**
   * Restores configuration from a backup.
   * @param backupId The backup identifier returned from createBackup
   * @returns Promise resolving to true if restore succeeded
   */
  restoreBackup(backupId: string): Promise<boolean>;

  /**
   * Deletes a backup after successful import.
   * @param backupId The backup identifier to delete
   */
  deleteBackup(backupId: string): Promise<void>;
}
