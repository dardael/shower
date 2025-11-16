import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { getClientIP } from '@/infrastructure/shared/utils/clientIP';
import { getApiUrl } from '@/infrastructure/shared/utils/appUrl';

/**
 * Public API endpoint for social networks
 * Returns only configured social networks for footer display
 * No authentication required - public endpoint
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const logger = container.resolve<Logger>('Logger');

  const clientIP = getClientIP(request);

  logger.logApiRequest('GET', '/api/public/social-networks', undefined, {
    userAgent: request.headers.get('user-agent'),
    ip: clientIP,
  });

  try {
    // Use fetch with cache tags to enable Next.js Data Cache invalidation
    const response = await fetch(getApiUrl('/api/settings/social-networks'), {
      next: {
        tags: ['social-networks']
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch social networks: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch social networks');
    }

    const socialNetworks = data.data || [];

    // Transform to public DTO with only necessary data
    const publicSocialNetworks = socialNetworks.map((network: {
      type: string;
      url: string;
      label: string;
      enabled: boolean;
    }) => ({
      type: network.type,
      url: network.url,
      label: network.label,
      icon: network.type, // Will be resolved by frontend
    }));

    const duration = Date.now() - startTime;

    logger.logApiResponse('GET', '/api/public/social-networks', 200, duration, {
      count: publicSocialNetworks.length,
      types: publicSocialNetworks.map((sn: { type: string }) => sn.type),
      cacheTag: 'social-networks',
    });

    // Return response without HTTP cache headers - relying on Next.js Data Cache only
    return NextResponse.json({
      success: true,
      data: publicSocialNetworks,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.logErrorWithObject(error, 'Failed to fetch social networks', {
      endpoint: '/api/public/social-networks',
      duration,
    });

    logger.logApiResponse('GET', '/api/public/social-networks', 500, duration);

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