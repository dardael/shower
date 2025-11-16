/**
 * Application URL configuration utilities
 */

/**
 * Gets the base URL for the application based on environment configuration
 * @returns The base URL for the current environment
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || getDefaultBaseUrl();
}

/**
 * Gets the default base URL based on the current environment
 * @returns The default base URL for the current environment
 */
function getDefaultBaseUrl(): string {
  const env = process.env.SHOWER_ENV || process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return 'https://localhost:3000'; // Production should have NEXT_PUBLIC_APP_URL set
    case 'test':
      return 'http://localhost:3000'; // Test environment default
    case 'development':
    default:
      return 'http://localhost:3000'; // Development environment default
  }
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
