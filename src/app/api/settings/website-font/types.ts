import type {
  FontMetadata,
  FontCategory,
} from '@/domain/settings/constants/AvailableFonts';

/**
 * Response for GET /api/settings/website-font
 */
export interface GetWebsiteFontResponse {
  websiteFont: string;
}

/**
 * Request body for POST /api/settings/website-font
 */
export interface UpdateWebsiteFontRequest {
  websiteFont: string;
}

/**
 * Response for POST /api/settings/website-font
 */
export interface UpdateWebsiteFontResponse {
  message: string;
  websiteFont: string;
}

/**
 * Response for GET /api/settings/available-fonts
 */
export interface GetAvailableFontsResponse {
  fonts: FontMetadata[];
}

/**
 * Error response for font endpoints
 */
export interface WebsiteFontErrorResponse {
  error: string;
}

// Re-export types from domain for API consumers
export type { FontMetadata, FontCategory };
