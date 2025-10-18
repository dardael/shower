import { WebsiteSettings } from '../entities/WebsiteSettings';
import { WebsiteIcon } from '../value-objects/WebsiteIcon';

export interface WebsiteSettingsRepository {
  getSettingsByKey(key: string): Promise<WebsiteSettings>;
  updateSettings(settings: WebsiteSettings): Promise<void>;
  updateIcon(key: string, icon: WebsiteIcon | null): Promise<void>;
  getIcon(key: string): Promise<WebsiteIcon | null>;
}
