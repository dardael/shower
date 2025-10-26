import type { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

/**
 * Response type for GET /api/settings
 */
export interface GetSettingsResponse {
  name: string;
  themeColor?: ThemeColorToken;
}

/**
 * Request body type for POST /api/settings
 */
export interface UpdateSettingsRequest {
  name?: string;
  themeColor?: string;
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
