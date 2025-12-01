import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { getClientIP } from '@/infrastructure/shared/utils/clientIP';
import type { GetMenuItems } from '@/application/menu/GetMenuItems';

/**
 * Public API endpoint for menu items
 * Returns configured menu items for header display
 * No authentication required - public endpoint
 * Uses direct use case access (not fetch) because admin menu endpoint requires auth
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
    const getMenuItems = container.resolve<GetMenuItems>('IGetMenuItems');
    const menuItems = await getMenuItems.execute();

    const publicMenuItems = menuItems.map((item) => ({
      id: item.id,
      text: item.text.value,
      url: item.url.value,
      position: item.position,
    }));

    const duration = Date.now() - startTime;

    logger.logApiResponse('GET', '/api/public/menu', 200, duration, {
      count: publicMenuItems.length,
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
