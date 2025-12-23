import { injectable, inject } from 'tsyringe';
import type { IDatabaseBackupService } from '@/domain/backup/ports/IDatabaseBackupService';
import type { DatabaseBackup } from '@/domain/backup/entities/DatabaseBackup';

@injectable()
export class ListDatabaseBackups {
  constructor(
    @inject('IDatabaseBackupService')
    private readonly backupService: IDatabaseBackupService
  ) {}

  async execute(): Promise<DatabaseBackup[]> {
    return this.backupService.listBackups();
  }
}
