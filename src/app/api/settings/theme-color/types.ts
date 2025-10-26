import type { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

/**
 * Response type for GET /api/settings/theme-color
 */
export interface GetThemeColorResponse {
  themeColor: ThemeColorToken;
}

/**
 * Request body type for POST /api/settings/theme-color
 */
export interface UpdateThemeColorRequest {
  themeColor: ThemeColorToken;
}

/**
 * Response type for POST /api/settings/theme-color
 */
export interface UpdateThemeColorResponse {
  message: string;
  themeColor: ThemeColorToken;
}

/**
 * Error response type for theme color API
 */
export interface ThemeColorErrorResponse {
  error: string;
}
