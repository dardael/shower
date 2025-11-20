/**
 * Application URL configuration utilities
 */

/**
 * Gets the base URL for the application based on environment configuration
 * @returns The base URL for the current environment
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL;
}

/**
 * Gets full URL for a specific API endpoint
 * @param endpoint - The API endpoint path
 * @returns The full URL for API endpoint
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getBaseUrl();
  // Ensure endpoint starts with / for proper URL construction
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;
  return `${baseUrl}${normalizedEndpoint}`;
}
