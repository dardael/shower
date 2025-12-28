/**
 * Response type for GET /api/settings/loader-background-color
 */
export interface GetLoaderBackgroundColorResponse {
  value: string | null;
}

/**
 * Request body type for POST /api/settings/loader-background-color
 */
export interface UpdateLoaderBackgroundColorRequest {
  value: string | null;
}

/**
 * Response type for POST /api/settings/loader-background-color
 */
export interface UpdateLoaderBackgroundColorResponse {
  success: boolean;
  value: string | null;
}

/**
 * Error response type for loader background color API
 */
export interface LoaderBackgroundColorErrorResponse {
  error: string;
}
