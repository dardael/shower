import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { getClientIP } from '@/infrastructure/shared/utils/clientIP';
import { getApiUrl } from '@/infrastructure/shared/utils/appUrl';

/**
 * Public API endpoint for website name
 * Returns the configured website name for public display
 * No authentication required - public endpoint
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const logger = container.resolve<Logger>('Logger');

  const clientIP = getClientIP(request);

  logger.logApiRequest('GET', '/api/public/website-name', undefined, {
    userAgent: request.headers.get('user-agent'),
    ip: clientIP,
  });

  try {
    // Use fetch with cache tags to enable Next.js Data Cache invalidation
    const response = await fetch(getApiUrl('/api/settings/name'), {
      next: {
        tags: ['website-name']
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website name: ${response.status}`);
    }

    const data = await response.json();

    const duration = Date.now() - startTime;

    logger.logApiResponse('GET', '/api/public/website-name', 200, duration, {
      name: data.name || '',
      cacheTag: 'website-name',
    });

    // Return response with success wrapper
    return NextResponse.json({
      success: true,
      data: data.name || '',
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.logErrorWithObject(error, 'Failed to fetch website name', {
      endpoint: '/api/public/website-name',
      duration,
    });

    logger.logApiResponse('GET', '/api/public/website-name', 500, duration);

    // Don't expose internal errors in public endpoint
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
