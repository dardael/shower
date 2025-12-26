/**
 * Response type for GET /api/settings/header-menu-text-color
 */
export interface GetHeaderMenuTextColorResponse {
  value: string;
}

/**
 * Request body type for POST /api/settings/header-menu-text-color
 */
export interface UpdateHeaderMenuTextColorRequest {
  value: string;
}

/**
 * Response type for POST /api/settings/header-menu-text-color
 */
export interface UpdateHeaderMenuTextColorResponse {
  success: boolean;
  value: string;
}

/**
 * Error response type for header menu text color API
 */
export interface HeaderMenuTextColorErrorResponse {
  error: string;
}
