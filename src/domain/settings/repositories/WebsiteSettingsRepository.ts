import {
  WebsiteSetting,
  SettingValue,
} from '@/domain/settings/entities/WebsiteSetting';

export interface WebsiteSettingsRepository {
  getByKey(key: string): Promise<WebsiteSetting>;
  setByKey(key: string, value: SettingValue): Promise<void>;
}
