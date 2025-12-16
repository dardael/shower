/**
 * Application URL configuration utilities
 */

/**
 * Gets the base URL for the application based on environment configuration
 * For client-side code, returns empty string to use relative URLs
 * For server-side code, returns the configured base URL
 * @returns The base URL for the current environment
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '';
  }
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

/**
 * Converts an absolute URL to a relative URL
 * This is useful for ensuring images work from any domain (localhost, IP, production)
 * @param url - The URL to convert (can be absolute or relative)
 * @returns The relative URL path
 * @example
 * toRelativeUrl('http://localhost:3000/api/icons/logo.png') // returns '/api/icons/logo.png'
 * toRelativeUrl('/api/icons/logo.png') // returns '/api/icons/logo.png'
 */
export function toRelativeUrl(url: string): string {
  if (!url || typeof url !== 'string') return url;

  // If already relative, return as-is
  if (url.startsWith('/')) return url;

  // Match pattern: http(s)://domain:port/path or http(s)://domain/path
  const urlPattern = /^https?:\/\/[^/]+(\/.*)/;
  const match = url.match(urlPattern);

  if (match && match[1]) {
    return match[1]; // Return the path part only
  }

  return url; // Return as-is if not a valid absolute URL
}
