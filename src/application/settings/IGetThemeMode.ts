import { ThemeModePreference } from '@/domain/settings/value-objects/ThemeModePreference';

/**
 * Interface for retrieving theme mode configuration
 */
export interface IGetThemeMode {
  execute(): Promise<ThemeModePreference>;
}
