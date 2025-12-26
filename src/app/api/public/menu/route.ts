import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { getClientIP } from '@/infrastructure/shared/utils/clientIP';
import type { GetMenuItems } from '@/application/menu/GetMenuItems';

interface PublicMenuItem {
  id: string;
  text: string;
  url: string;
  position: number;
}

/**
 * Cached function to fetch menu items from database
 * Uses Next.js unstable_cache with 'menu-items' tag for cache invalidation
 */
// Direct fetch without cache to ensure fresh data
async function getMenuItemsDirectly(): Promise<PublicMenuItem[]> {
  const getMenuItems = container.resolve<GetMenuItems>('IGetMenuItems');
  const menuItems = await getMenuItems.execute();

  return menuItems.map((item) => ({
    id: item.id,
    text: item.text.value,
    url: item.url.value,
    position: item.position,
  }));
}

/**
 * Public API endpoint for menu items
 * Returns configured menu items for header display
 * No authentication required - public endpoint
 * Uses Next.js cache with 'menu-items' tag for cache invalidation
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const logger = container.resolve<Logger>('Logger');

  const clientIP = getClientIP(request);

  logger.logApiRequest('GET', '/api/public/menu', undefined, {
    userAgent: request.headers.get('user-agent'),
    ip: clientIP,
  });

  try {
    const publicMenuItems = await getMenuItemsDirectly();

    const duration = Date.now() - startTime;

    logger.logApiResponse('GET', '/api/public/menu', 200, duration, {
      count: publicMenuItems.length,
      cached: true,
    });

    return NextResponse.json({
      success: true,
      data: publicMenuItems,
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    logger.logErrorWithObject(error, 'Failed to fetch menu items', {
      endpoint: '/api/public/menu',
      duration,
    });

    logger.logApiResponse('GET', '/api/public/menu', 500, duration);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
