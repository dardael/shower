import { NextRequest, NextResponse } from 'next/server';
import { SettingsServiceLocator } from '@/infrastructure/container';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import {
  isValidThemeColor,
  getThemeColorErrorMessage,
  ThemeColorToken,
} from '@/domain/settings/constants/ThemeColorPalette';
import type {
  GetThemeColorResponse,
  UpdateThemeColorRequest,
  UpdateThemeColorResponse,
  ThemeColorErrorResponse,
} from './types';

export const GET = withApi(
  async (
    request: NextRequest
  ): Promise<NextResponse<GetThemeColorResponse | ThemeColorErrorResponse>> => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'GET',
        '/api/settings/theme-color',
        request.headers.get('x-user-id') || undefined
      );

      // Get current theme color
      const getThemeColor = SettingsServiceLocator.getGetThemeColor();
      const themeColor = await getThemeColor.execute();

      // Generate ETag for conditional requests
      const etag = `"theme-color-${themeColor.value}"`;
      const ifNoneMatch = request.headers.get('if-none-match');

      // Return 304 Not Modified if ETag matches
      if (ifNoneMatch === etag) {
        const duration = Date.now() - startTime;
        logger.logApiResponse(
          'GET',
          '/api/settings/theme-color',
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

      logger.info('Theme color retrieved successfully', {
        themeColor: themeColor.value,
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse('GET', '/api/settings/theme-color', 200, duration, {
        themeColor: themeColor.value,
      });

      const response: GetThemeColorResponse = {
        themeColor: themeColor.value,
      };
      return NextResponse.json(response, {
        headers: {
          'Cache-Control':
            'public, max-age=1800, stale-while-revalidate=3600, immutable',
          ETag: `"theme-color-${themeColor.value}"`,
        },
      });
    } catch (error) {
      logger.logError(error, 'Error getting theme color', {
        method: 'GET',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse('GET', '/api/settings/theme-color', 500, duration);

      const errorResponse: ThemeColorErrorResponse = {
        error: 'Failed to retrieve theme color. Please try again later.',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  }
);

export const POST = withApi(
  async (
    request: NextRequest
  ): Promise<
    NextResponse<UpdateThemeColorResponse | ThemeColorErrorResponse>
  > => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'POST',
        '/api/settings/theme-color',
        request.headers.get('x-user-id') || undefined
      );

      // Parse request body with enhanced error handling
      let body: UpdateThemeColorRequest;
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
          '/api/settings/theme-color',
          400,
          duration
        );

        const errorResponse: ThemeColorErrorResponse = {
          error:
            'Invalid request format. Please ensure your request contains valid JSON.',
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      const { themeColor } = body;

      // Validate theme color with enhanced type guard
      if (!isValidThemeColor(themeColor)) {
        logger.warn('Invalid theme color provided', {
          themeColor,
          themeColorType: typeof themeColor,
        });

        const duration = Date.now() - startTime;
        logger.logApiResponse(
          'POST',
          '/api/settings/theme-color',
          400,
          duration
        );

        const errorResponse: ThemeColorErrorResponse = {
          error: getThemeColorErrorMessage(),
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      // Update theme color
      const updateThemeColor = SettingsServiceLocator.getUpdateThemeColor();
      const themeColorValue = ThemeColor.create(themeColor);

      await updateThemeColor.execute(themeColorValue);

      logger.info('Theme color updated successfully', {
        newThemeColor: themeColorValue.value,
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'POST',
        '/api/settings/theme-color',
        200,
        duration,
        {
          themeColor: themeColorValue.value,
        }
      );

      const response: UpdateThemeColorResponse = {
        message: 'Theme color updated successfully',
        themeColor: themeColorValue.value,
      };
      return NextResponse.json(response, {
        headers: {
          'Cache-Control': 'no-cache, must-revalidate',
        },
      });
    } catch (error) {
      logger.logError(error, 'Error updating theme color', {
        method: 'POST',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse('POST', '/api/settings/theme-color', 500, duration);

      const errorResponse: ThemeColorErrorResponse = {
        error: 'Failed to update theme color. Please try again later.',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  },
  { requireAuth: true }
);
