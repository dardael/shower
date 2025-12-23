import { BackupConfiguration } from '../entities/BackupConfiguration';

/**
 * Port for backup configuration repository operations.
 */
export interface IBackupConfigurationRepository {
  /**
   * Get the current backup configuration.
   * Returns default configuration if none exists.
   */
  get(): Promise<BackupConfiguration>;

  /**
   * Save the backup configuration.
   */
  save(configuration: BackupConfiguration): Promise<void>;
}
