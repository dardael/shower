import { injectable, inject } from 'tsyringe';
import type { IDatabaseBackupService } from '@/domain/backup/ports/IDatabaseBackupService';
import type { DatabaseBackup } from '@/domain/backup/entities/DatabaseBackup';

@injectable()
export class RestoreDatabaseBackup {
  constructor(
    @inject('IDatabaseBackupService')
    private readonly backupService: IDatabaseBackupService
  ) {}

  async execute(backup: DatabaseBackup): Promise<void> {
    if (!backup.isRestorable()) {
      throw new Error('Cette sauvegarde ne peut pas être restaurée');
    }

    await this.backupService.restoreBackup(backup);
  }
}
