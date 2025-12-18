import { injectable, inject } from 'tsyringe';
import type { IScheduledRestartConfigRepository } from '@/domain/config/repositories/IScheduledRestartConfigRepository';
import { ScheduledRestartConfig } from '@/domain/config/value-objects/ScheduledRestartConfig';
import { WebsiteSettingsModel } from '@/infrastructure/settings/models/WebsiteSettingsModel';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';
import { Logger } from '@/application/shared/Logger';

@injectable()
export class MongooseScheduledRestartConfigRepository
  implements IScheduledRestartConfigRepository
{
  constructor(@inject('Logger') private readonly logger: Logger) {}

  async get(): Promise<ScheduledRestartConfig> {
    try {
      const settingDoc = await WebsiteSettingsModel.findOne({
        key: VALID_SETTING_KEYS.SCHEDULED_RESTART,
      });

      if (!settingDoc) {
        return ScheduledRestartConfig.default();
      }

      return ScheduledRestartConfig.create(settingDoc.value);
    } catch (error) {
      this.logger.error('Failed to get scheduled restart config', { error });
      return ScheduledRestartConfig.default();
    }
  }

  async save(config: ScheduledRestartConfig): Promise<void> {
    try {
      await WebsiteSettingsModel.updateOne(
        { key: VALID_SETTING_KEYS.SCHEDULED_RESTART },
        {
          $set: {
            key: VALID_SETTING_KEYS.SCHEDULED_RESTART,
            value: config.toValue(),
          },
        },
        { upsert: true }
      );
      this.logger.info('Scheduled restart config saved', {
        enabled: config.enabled,
        restartHour: config.restartHour,
        timezone: config.timezone,
      });
    } catch (error) {
      this.logger.error('Failed to save scheduled restart config', { error });
      throw error;
    }
  }
}
