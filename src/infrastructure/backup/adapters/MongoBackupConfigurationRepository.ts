import { injectable } from 'tsyringe';
import type { IBackupConfigurationRepository } from '@/domain/backup/ports/IBackupConfigurationRepository';
import { BackupConfiguration } from '@/domain/backup/entities/BackupConfiguration';
import { BackupConfigurationModel } from '@/infrastructure/backup/models/BackupConfigurationModel';

@injectable()
export class MongoBackupConfigurationRepository
  implements IBackupConfigurationRepository
{
  async get(): Promise<BackupConfiguration> {
    const doc = await BackupConfigurationModel.findOne();
    if (!doc) {
      return BackupConfiguration.create();
    }
    return BackupConfiguration.create({
      enabled: doc.enabled,
      scheduledHour: doc.scheduledHour,
      retentionCount: doc.retentionCount,
      timezone: doc.timezone,
      lastBackupAt: doc.lastBackupAt,
    });
  }

  async save(configuration: BackupConfiguration): Promise<void> {
    await BackupConfigurationModel.findOneAndUpdate(
      {},
      {
        enabled: configuration.enabled,
        scheduledHour: configuration.scheduledHour,
        retentionCount: configuration.retentionCount,
        timezone: configuration.timezone,
        lastBackupAt: configuration.lastBackupAt,
      },
      { upsert: true, new: true }
    );
  }
}
