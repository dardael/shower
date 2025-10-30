import { NextRequest } from 'next/server';

/**
 * Extract client IP address from request headers
 * Supports various proxy configurations and cloud environments
 */
export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') || // Cloudflare
    request.headers.get('x-client-ip') ||
    request.headers.get('x-forwarded') ||
    request.headers.get('forwarded-for') ||
    request.headers.get('forwarded') ||
    'unknown'
  );
}
