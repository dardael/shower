import { inject, injectable } from 'tsyringe';
import type { IBackupConfigurationRepository } from '@/domain/backup/ports/IBackupConfigurationRepository';
import { BackupConfiguration } from '@/domain/backup/entities/BackupConfiguration';

export interface UpdateBackupConfigurationInput {
  enabled?: boolean;
  scheduledHour?: number;
  retentionCount?: number;
  timezone?: string;
}

export interface IUpdateBackupConfiguration {
  execute(input: UpdateBackupConfigurationInput): Promise<BackupConfiguration>;
}

@injectable()
export class UpdateBackupConfiguration implements IUpdateBackupConfiguration {
  constructor(
    @inject('IBackupConfigurationRepository')
    private readonly repository: IBackupConfigurationRepository
  ) {}

  async execute(
    input: UpdateBackupConfigurationInput
  ): Promise<BackupConfiguration> {
    let config = await this.repository.get();

    if (input.enabled !== undefined) {
      config = config.withEnabled(input.enabled);
    }

    if (input.scheduledHour !== undefined) {
      config = config.withScheduledHour(input.scheduledHour);
    }

    if (input.retentionCount !== undefined) {
      config = config.withRetentionCount(input.retentionCount);
    }

    if (input.timezone !== undefined) {
      config = config.withTimezone(input.timezone);
    }

    await this.repository.save(config);

    return config;
  }
}
