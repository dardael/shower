import type { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';
import type { ThemeModeValue } from '@/domain/settings/value-objects/ThemeModePreference';

/**
 * Response type for GET /api/settings
 */
export interface GetSettingsResponse {
  name: string;
  themeColor?: ThemeColorToken;
  backgroundColor?: ThemeColorToken;
  themeMode: ThemeModeValue;
  sellingEnabled: boolean;
}

/**
 * Request body type for POST /api/settings
 */
export interface UpdateSettingsRequest {
  name?: string;
  themeColor?: string;
  backgroundColor?: string;
  themeMode?: string;
  sellingEnabled?: boolean;
}

/**
 * Response type for POST /api/settings
 */
export interface UpdateSettingsResponse {
  message: string;
}

/**
 * Error response type for settings API
 */
export interface SettingsErrorResponse {
  error: string;
}
