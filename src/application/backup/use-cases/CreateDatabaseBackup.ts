import { inject, injectable } from 'tsyringe';
import type { IDatabaseBackupService } from '@/domain/backup/ports/IDatabaseBackupService';
import type { IBackupConfigurationRepository } from '@/domain/backup/ports/IBackupConfigurationRepository';
import { DatabaseBackup } from '@/domain/backup/entities/DatabaseBackup';

export interface ICreateDatabaseBackup {
  execute(): Promise<DatabaseBackup>;
}

@injectable()
export class CreateDatabaseBackup implements ICreateDatabaseBackup {
  constructor(
    @inject('IDatabaseBackupService')
    private readonly backupService: IDatabaseBackupService,
    @inject('IBackupConfigurationRepository')
    private readonly configRepository: IBackupConfigurationRepository
  ) {}

  async execute(): Promise<DatabaseBackup> {
    const backup = await this.backupService.createBackup();

    // Update last backup timestamp
    const config = await this.configRepository.get();
    const updatedConfig = config.withLastBackupAt(new Date());
    await this.configRepository.save(updatedConfig);

    // Apply retention policy
    const currentConfig = await this.configRepository.get();
    await this.backupService.enforceRetentionLimit(
      currentConfig.retentionCount
    );

    return backup;
  }
}
