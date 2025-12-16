import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { getClientIP } from '@/infrastructure/shared/utils/clientIP';
import { toRelativeUrl } from '@/infrastructure/shared/utils/appUrl';
import type { IGetHeaderLogo } from '@/application/settings/IGetHeaderLogo';

/**
 * Public API endpoint for header logo
 * Returns configured logo for header display
 * No authentication required - public endpoint
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const logger = container.resolve<Logger>('Logger');

  const clientIP = getClientIP(request);

  logger.logApiRequest('GET', '/api/public/logo', undefined, {
    userAgent: request.headers.get('user-agent'),
    ip: clientIP,
  });

  try {
    const getHeaderLogo = container.resolve<IGetHeaderLogo>('IGetHeaderLogo');
    const headerLogo = await getHeaderLogo.execute();

    const duration = Date.now() - startTime;

    if (!headerLogo) {
      logger.logApiResponse('GET', '/api/public/logo', 200, duration, {
        hasLogo: false,
      });

      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    const logoData = {
      url: toRelativeUrl(headerLogo.url),
      filename: headerLogo.filename,
      format: headerLogo.format,
    };

    logger.logApiResponse('GET', '/api/public/logo', 200, duration, {
      hasLogo: true,
      filename: logoData.filename,
    });

    return NextResponse.json({
      success: true,
      data: logoData,
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    logger.logErrorWithObject(error, 'Failed to fetch header logo', {
      endpoint: '/api/public/logo',
      duration,
    });

    logger.logApiResponse('GET', '/api/public/logo', 500, duration);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
