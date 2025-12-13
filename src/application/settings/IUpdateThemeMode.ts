import { ThemeModePreference } from '@/domain/settings/value-objects/ThemeModePreference';

/**
 * Interface for updating theme mode configuration
 */
export interface IUpdateThemeMode {
  execute(themeMode: ThemeModePreference): Promise<void>;
}
