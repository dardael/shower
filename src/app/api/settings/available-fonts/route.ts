import { NextRequest, NextResponse } from 'next/server';
import { SettingsServiceLocator } from '@/infrastructure/container';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import type {
  GetAvailableFontsResponse,
  WebsiteFontErrorResponse,
} from '../website-font/types';

export const GET = withApi(
  async (
    request: NextRequest
  ): Promise<
    NextResponse<GetAvailableFontsResponse | WebsiteFontErrorResponse>
  > => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'GET',
        '/api/settings/available-fonts',
        request.headers.get('x-user-id') || undefined
      );

      // Get available fonts
      const getAvailableFonts = SettingsServiceLocator.getGetAvailableFonts();
      const fonts = await getAvailableFonts.execute();

      logger.info('Available fonts retrieved successfully', {
        fontCount: fonts.length,
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'GET',
        '/api/settings/available-fonts',
        200,
        duration,
        {
          fontCount: fonts.length,
        }
      );

      const response: GetAvailableFontsResponse = {
        fonts,
      };
      return NextResponse.json(response, {
        headers: {
          // Cache for 24 hours since font list is static
          'Cache-Control': 'public, max-age=86400, immutable',
        },
      });
    } catch (error) {
      logger.logErrorWithObject(error, 'Error getting available fonts', {
        method: 'GET',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'GET',
        '/api/settings/available-fonts',
        500,
        duration
      );

      const errorResponse: WebsiteFontErrorResponse = {
        error: 'Failed to retrieve available fonts. Please try again later.',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  }
);
