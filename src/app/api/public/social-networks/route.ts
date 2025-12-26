import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { getClientIP } from '@/infrastructure/shared/utils/clientIP';
import type { IGetSocialNetworks } from '@/application/settings/IGetSocialNetworks';

interface PublicSocialNetwork {
  type: string;
  url: string;
  label: string;
  icon: string;
}

/**
 * Public API endpoint for social networks
 * Returns only configured social networks for footer display
 * No authentication required - public endpoint
 */

async function fetchSocialNetworks(): Promise<PublicSocialNetwork[]> {
  const getSocialNetworks =
    container.resolve<IGetSocialNetworks>('IGetSocialNetworks');
  const socialNetworks = await getSocialNetworks.execute();

  // Filter only enabled social networks and transform to public DTO
  return socialNetworks
    .filter((network) => network.enabled)
    .map((network) => ({
      type: network.type.value,
      url: network.url.value,
      label: network.label.value,
      icon: network.type.value,
    }));
}

const getCachedSocialNetworks = unstable_cache(
  fetchSocialNetworks,
  ['social-networks'],
  {
    tags: ['social-networks'],
    revalidate: 3600,
  }
);

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const logger = container.resolve<Logger>('Logger');

  const clientIP = getClientIP(request);

  logger.logApiRequest('GET', '/api/public/social-networks', undefined, {
    userAgent: request.headers.get('user-agent'),
    ip: clientIP,
  });

  try {
    const publicSocialNetworks = await getCachedSocialNetworks();

    const duration = Date.now() - startTime;

    logger.logApiResponse('GET', '/api/public/social-networks', 200, duration, {
      count: publicSocialNetworks.length,
      types: publicSocialNetworks.map((sn) => sn.type),
      cacheTag: 'social-networks',
    });

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

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
