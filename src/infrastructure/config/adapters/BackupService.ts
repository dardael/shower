import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import type { IBackupService } from '@/domain/config/ports/IBackupService';
import type { IConfigurationExporter } from '@/domain/config/ports/IConfigurationExporter';
import type { ILogger } from '@/application/shared/ILogger';

const BACKUP_DIR = path.join(process.cwd(), 'temp', 'backups');

function generateBackupId(): string {
  return crypto.randomUUID();
}

/**
 * BackupService adapter implementing IBackupService.
 * Creates and manages temporary ZIP backups for safe import operations.
 */
export class BackupService implements IBackupService {
  constructor(
    private readonly exporter: IConfigurationExporter,
    private readonly logger: ILogger
  ) {}

  async createBackup(): Promise<string | null> {
    try {
      this.logger.logInfo('Creating backup before import');

      // Ensure backup directory exists
      if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
      }

      // Export current configuration to ZIP
      const zipBuffer = await this.exporter.exportToZip();

      // Generate unique backup ID and save
      const backupId = generateBackupId();
      const backupPath = this.getBackupPath(backupId);

      await fs.promises.writeFile(backupPath, zipBuffer);

      this.logger.logInfo(`Backup created: ${backupId}`);
      return backupId;
    } catch (error) {
      this.logger.logError(
        `Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return null;
    }
  }

  async restoreBackup(backupId: string): Promise<boolean> {
    try {
      this.logger.logInfo(`Restoring from backup: ${backupId}`);

      const backupPath = this.getBackupPath(backupId);

      if (!fs.existsSync(backupPath)) {
        this.logger.logError(`Backup not found: ${backupId}`);
        return false;
      }

      // Note: Actual restore would require importing the backup ZIP.
      // This is handled by the ImportConfiguration use case calling
      // the importer with the backup buffer.
      this.logger.logInfo(`Backup restore initiated: ${backupId}`);
      return true;
    } catch (error) {
      this.logger.logError(
        `Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return false;
    }
  }

  async deleteBackup(backupId: string): Promise<void> {
    try {
      const backupPath = this.getBackupPath(backupId);

      if (fs.existsSync(backupPath)) {
        await fs.promises.unlink(backupPath);
        this.logger.logInfo(`Backup deleted: ${backupId}`);
      }
    } catch (error) {
      this.logger.logWarning(
        `Failed to delete backup: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Gets the backup file buffer for restore operations.
   * @param backupId The backup identifier
   * @returns The backup ZIP buffer or null if not found
   */
  async getBackupBuffer(backupId: string): Promise<Buffer | null> {
    try {
      const backupPath = this.getBackupPath(backupId);

      if (!fs.existsSync(backupPath)) {
        return null;
      }

      return await fs.promises.readFile(backupPath);
    } catch {
      return null;
    }
  }

  private getBackupPath(backupId: string): string {
    return path.join(BACKUP_DIR, `backup-${backupId}.zip`);
  }
}
