import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import type { IGetConfiguredSocialNetworks } from '@/application/settings/IGetConfiguredSocialNetworks';
import { Logger } from '@/application/shared/Logger';
import { getClientIP } from '@/infrastructure/shared/utils/clientIP';

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
    const getSocialNetworks = container.resolve<IGetConfiguredSocialNetworks>('IGetConfiguredSocialNetworks');
    const socialNetworks = await getSocialNetworks.execute();

    // Transform to public DTO with only necessary data
    const publicSocialNetworks = socialNetworks.map(network => ({
      type: network.type.value,
      url: network.url.value,
      label: network.getDisplayLabel(),
      icon: network.getIconComponent(),
    }));

    const duration = Date.now() - startTime;

    logger.logApiResponse('GET', '/api/public/social-networks', 200, duration, {
      count: publicSocialNetworks.length,
      types: publicSocialNetworks.map(sn => sn.type),
    });

    // Return with caching headers for performance
    return NextResponse.json({
      success: true,
      data: publicSocialNetworks,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // 5 minutes cache
        'CDN-Cache-Control': 'public, max-age=86400', // 24 hours CDN cache
        'Vary': 'Accept-Encoding',
      },
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