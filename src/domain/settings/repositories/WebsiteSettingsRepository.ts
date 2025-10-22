import { WebsiteSettings } from '@/domain/settings/entities/WebsiteSettings';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';

export interface WebsiteSettingsRepository {
  getSettingsByKey(key: string): Promise<WebsiteSettings>;
  updateSettings(settings: WebsiteSettings): Promise<void>;
  updateIcon(key: string, icon: WebsiteIcon | null): Promise<void>;
  getIcon(key: string): Promise<WebsiteIcon | null>;
}
