import { NextRequest, NextResponse } from 'next/server';
import { SettingsServiceLocator } from '@/infrastructure/container';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { WebsiteFont } from '@/domain/settings/value-objects/WebsiteFont';
import {
  isValidFont,
  getFontErrorMessage,
} from '@/domain/settings/constants/AvailableFonts';
import type {
  GetWebsiteFontResponse,
  UpdateWebsiteFontRequest,
  UpdateWebsiteFontResponse,
  WebsiteFontErrorResponse,
} from './types';

export const GET = withApi(
  async (
    request: NextRequest
  ): Promise<
    NextResponse<GetWebsiteFontResponse | WebsiteFontErrorResponse>
  > => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'GET',
        '/api/settings/website-font',
        request.headers.get('x-user-id') || undefined
      );

      // Get current website font
      const getWebsiteFont = SettingsServiceLocator.getGetWebsiteFont();
      const websiteFont = await getWebsiteFont.execute();

      // Generate ETag for conditional requests
      const etag = `"website-font-${websiteFont.value}"`;
      const ifNoneMatch = request.headers.get('if-none-match');

      // Return 304 Not Modified if ETag matches
      if (ifNoneMatch === etag) {
        const duration = Date.now() - startTime;
        logger.logApiResponse(
          'GET',
          '/api/settings/website-font',
          304,
          duration,
          {
            cached: true,
          }
        );

        return new NextResponse(null, {
          status: 304,
          headers: {
            'Cache-Control':
              'public, max-age=1800, stale-while-revalidate=3600, immutable',
            ETag: etag,
          },
        });
      }

      logger.info('Website font retrieved successfully', {
        websiteFont: websiteFont.value,
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'GET',
        '/api/settings/website-font',
        200,
        duration,
        {
          websiteFont: websiteFont.value,
        }
      );

      const response: GetWebsiteFontResponse = {
        websiteFont: websiteFont.value,
      };
      return NextResponse.json(response, {
        headers: {
          'Cache-Control':
            'public, max-age=1800, stale-while-revalidate=3600, immutable',
          ETag: `"website-font-${websiteFont.value}"`,
        },
      });
    } catch (error) {
      logger.logErrorWithObject(error, 'Error getting website font', {
        method: 'GET',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse('GET', '/api/settings/website-font', 500, duration);

      const errorResponse: WebsiteFontErrorResponse = {
        error: 'Failed to retrieve website font. Please try again later.',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  }
);

export const POST = withApi(
  async (
    request: NextRequest
  ): Promise<
    NextResponse<UpdateWebsiteFontResponse | WebsiteFontErrorResponse>
  > => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'POST',
        '/api/settings/website-font',
        request.headers.get('x-user-id') || undefined
      );

      // Parse request body with enhanced error handling
      let body: UpdateWebsiteFontRequest;
      try {
        body = await request.json();
      } catch (parseError) {
        logger.warn('Invalid JSON in request body', {
          method: 'POST',
          error:
            parseError instanceof Error
              ? parseError.message
              : 'Unknown parsing error',
        });

        const duration = Date.now() - startTime;
        logger.logApiResponse(
          'POST',
          '/api/settings/website-font',
          400,
          duration
        );

        const errorResponse: WebsiteFontErrorResponse = {
          error:
            'Invalid request format. Please ensure your request contains valid JSON.',
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      const { websiteFont } = body;

      // Validate font with type guard
      if (!isValidFont(websiteFont)) {
        logger.warn('Invalid website font provided', {
          websiteFont,
          websiteFontType: typeof websiteFont,
        });

        const duration = Date.now() - startTime;
        logger.logApiResponse(
          'POST',
          '/api/settings/website-font',
          400,
          duration
        );

        const errorResponse: WebsiteFontErrorResponse = {
          error: getFontErrorMessage(),
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      // Update website font
      const updateWebsiteFont = SettingsServiceLocator.getUpdateWebsiteFont();
      const websiteFontValue = WebsiteFont.create(websiteFont);

      await updateWebsiteFont.execute(websiteFontValue);

      logger.info('Website font updated successfully', {
        newWebsiteFont: websiteFontValue.value,
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'POST',
        '/api/settings/website-font',
        200,
        duration,
        {
          websiteFont: websiteFontValue.value,
        }
      );

      const response: UpdateWebsiteFontResponse = {
        message: 'Website font updated successfully',
        websiteFont: websiteFontValue.value,
      };
      return NextResponse.json(response, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'X-Cache-Invalidate': 'website-font',
        },
      });
    } catch (error) {
      logger.logErrorWithObject(error, 'Error updating website font', {
        method: 'POST',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'POST',
        '/api/settings/website-font',
        500,
        duration
      );

      const errorResponse: WebsiteFontErrorResponse = {
        error: 'Failed to update website font. Please try again later.',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  },
  { requireAuth: true }
);
