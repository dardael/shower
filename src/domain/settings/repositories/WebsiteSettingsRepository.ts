import { WebsiteSettings } from '../entities/WebsiteSettings';

export interface WebsiteSettingsRepository {
  getSettingsByKey(key: string): Promise<WebsiteSettings>;
  updateSettings(settings: WebsiteSettings): Promise<void>;
}
