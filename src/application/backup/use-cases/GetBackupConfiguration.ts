import { inject, injectable } from 'tsyringe';
import type { IBackupConfigurationRepository } from '@/domain/backup/ports/IBackupConfigurationRepository';
import { BackupConfiguration } from '@/domain/backup/entities/BackupConfiguration';

export interface IGetBackupConfiguration {
  execute(): Promise<BackupConfiguration>;
}

@injectable()
export class GetBackupConfiguration implements IGetBackupConfiguration {
  constructor(
    @inject('IBackupConfigurationRepository')
    private readonly repository: IBackupConfigurationRepository
  ) {}

  async execute(): Promise<BackupConfiguration> {
    return this.repository.get();
  }
}
