import { inject, injectable } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { AppointmentModuleEnabled } from '@/domain/appointment/value-objects/AppointmentModuleEnabled';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

export interface IGetAppointmentModuleEnabled {
  execute(): Promise<AppointmentModuleEnabled>;
}

@injectable()
export class GetAppointmentModuleEnabled
  implements IGetAppointmentModuleEnabled
{
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly settingsRepository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<AppointmentModuleEnabled> {
    const setting = await this.settingsRepository.getByKey(
      VALID_SETTING_KEYS.APPOINTMENT_MODULE_ENABLED
    );

    if (!setting) {
      return AppointmentModuleEnabled.disabled();
    }

    const value = setting.value;
    return AppointmentModuleEnabled.fromString(String(value));
  }
}

export interface IUpdateAppointmentModuleEnabled {
  execute(enabled: AppointmentModuleEnabled): Promise<void>;
}

@injectable()
export class UpdateAppointmentModuleEnabled
  implements IUpdateAppointmentModuleEnabled
{
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly settingsRepository: WebsiteSettingsRepository
  ) {}

  async execute(enabled: AppointmentModuleEnabled): Promise<void> {
    await this.settingsRepository.setByKey(
      VALID_SETTING_KEYS.APPOINTMENT_MODULE_ENABLED,
      enabled.toString()
    );
  }
}
