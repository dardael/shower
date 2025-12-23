import { injectable, inject } from 'tsyringe';
import type { IDatabaseBackupService } from '@/domain/backup/ports/IDatabaseBackupService';
import type { DatabaseBackup } from '@/domain/backup/entities/DatabaseBackup';

@injectable()
export class DeleteDatabaseBackup {
  constructor(
    @inject('IDatabaseBackupService')
    private readonly backupService: IDatabaseBackupService
  ) {}

  async execute(backup: DatabaseBackup): Promise<void> {
    await this.backupService.deleteBackup(backup);
  }
}
