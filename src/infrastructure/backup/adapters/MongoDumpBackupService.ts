import { injectable, inject } from 'tsyringe';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import type { IDatabaseBackupService } from '@/domain/backup/ports/IDatabaseBackupService';
import {
  DatabaseBackup,
  type BackupStatus,
} from '@/domain/backup/entities/DatabaseBackup';
import { DatabaseBackupModel } from '@/infrastructure/backup/models/DatabaseBackupModel';
import type { ILogger } from '@/application/shared/ILogger';

const execAsync = promisify(exec);
const BACKUP_DIR = path.join(process.cwd(), 'temp', 'backups');

@injectable()
export class MongoDumpBackupService implements IDatabaseBackupService {
  constructor(@inject('ILogger') private readonly logger: ILogger) {}

  async createBackup(): Promise<DatabaseBackup> {
    const backupId = randomUUID();
    const filePath = path.join(BACKUP_DIR, `${backupId}.dump`);
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await fs.promises.mkdir(BACKUP_DIR, { recursive: true });

    let status: BackupStatus = 'completed';
    let error: string | null = null;
    let sizeBytes = 0;

    try {
      await execAsync(`mongodump --uri="${mongoUri}" --archive="${filePath}"`);
      const stats = await fs.promises.stat(filePath);
      sizeBytes = stats.size;
      this.logger.logInfo(`Sauvegarde créée avec succès: ${backupId}`);
    } catch (err) {
      status = 'failed';
      error = err instanceof Error ? err.message : String(err);
      this.logger.logError(`Échec de la sauvegarde: ${error}`);
    }

    const backup = DatabaseBackup.create({
      id: backupId,
      createdAt: new Date(),
      filePath,
      sizeBytes,
      status,
      error,
    });

    await DatabaseBackupModel.create({
      backupId: backup.id,
      createdAt: backup.createdAt,
      filePath: backup.filePath,
      sizeBytes: backup.sizeBytes,
      status: backup.status,
      error: backup.error,
    });

    return backup;
  }

  async restoreBackup(backup: DatabaseBackup): Promise<void> {
    if (!backup.isRestorable()) {
      throw new Error(
        `Cette sauvegarde ne peut pas être restaurée (statut: ${backup.status})`
      );
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    try {
      await execAsync(
        `mongorestore --uri="${mongoUri}" --archive="${backup.filePath}" --drop`
      );
      this.logger.logInfo(`Restauration réussie depuis: ${backup.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.logError(`Échec de la restauration: ${errorMessage}`);
      throw new Error(`La restauration a échoué: ${errorMessage}`);
    }
  }

  async deleteBackup(backup: DatabaseBackup): Promise<void> {
    try {
      await fs.promises.unlink(backup.filePath);
    } catch {
      this.logger.logWarning(
        `Fichier de sauvegarde non trouvé sur le disque: ${backup.filePath}`
      );
    }

    await DatabaseBackupModel.deleteOne({ backupId: backup.id });
    this.logger.logInfo(`Sauvegarde supprimée: ${backup.id}`);
  }

  async listBackups(): Promise<DatabaseBackup[]> {
    const docs = await DatabaseBackupModel.find()
      .sort({ createdAt: -1 })
      .exec();

    return docs.map((doc) =>
      DatabaseBackup.create({
        id: doc.backupId,
        createdAt: doc.createdAt,
        filePath: doc.filePath,
        sizeBytes: doc.sizeBytes,
        status: doc.status as BackupStatus,
        error: doc.error,
      })
    );
  }

  async getBackupById(id: string): Promise<DatabaseBackup | null> {
    const doc = await DatabaseBackupModel.findOne({ backupId: id });
    if (!doc) {
      return null;
    }

    return DatabaseBackup.create({
      id: doc.backupId,
      createdAt: doc.createdAt,
      filePath: doc.filePath,
      sizeBytes: doc.sizeBytes,
      status: doc.status as BackupStatus,
      error: doc.error,
    });
  }

  async enforceRetentionLimit(retentionCount: number): Promise<void> {
    const allBackups = await this.listBackups();
    const completedBackups = allBackups.filter((b) => b.isRestorable());

    if (completedBackups.length <= retentionCount) {
      return;
    }

    const backupsToDelete = completedBackups.slice(retentionCount);
    for (const backup of backupsToDelete) {
      await this.deleteBackup(backup);
    }

    this.logger.logInfo(
      `Nettoyage terminé: ${backupsToDelete.length} sauvegarde(s) supprimée(s)`
    );
  }
}
