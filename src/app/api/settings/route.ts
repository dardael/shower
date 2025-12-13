import { NextRequest, NextResponse } from 'next/server';
import { SettingsServiceLocator } from '@/infrastructure/container';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import { BackgroundColor } from '@/domain/settings/value-objects/BackgroundColor';
import { ThemeModePreference } from '@/domain/settings/value-objects/ThemeModePreference';
import {
  isValidThemeColor,
  getThemeColorErrorMessage,
} from '@/domain/settings/constants/ThemeColorPalette';
import type {
  GetSettingsResponse,
  UpdateSettingsRequest,
  UpdateSettingsResponse,
  SettingsErrorResponse,
} from './types';

export const GET = withApi(
  async (
    request: NextRequest
  ): Promise<NextResponse<GetSettingsResponse | SettingsErrorResponse>> => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'GET',
        '/api/settings',
        request.headers.get('x-user-id') || undefined
      );

      // Get current settings
      const getThemeColor = SettingsServiceLocator.getGetThemeColor();
      const getBackgroundColor = SettingsServiceLocator.getGetBackgroundColor();
      const getWebsiteName = SettingsServiceLocator.getWebsiteName();
      const getThemeMode = SettingsServiceLocator.getGetThemeMode();

      const [themeColor, backgroundColor, websiteName, themeMode] =
        await Promise.all([
          getThemeColor.execute(),
          getBackgroundColor.execute(),
          getWebsiteName.execute(),
          getThemeMode.execute(),
        ]);

      logger.info('Website settings retrieved successfully', {
        websiteName: websiteName,
        themeColor: themeColor?.value,
        backgroundColor: backgroundColor?.value,
        themeMode: themeMode.value,
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse('GET', '/api/settings', 200, duration, {
        websiteName: websiteName,
        themeColor: themeColor?.value,
        backgroundColor: backgroundColor?.value,
        themeMode: themeMode.value,
      });

      const response: GetSettingsResponse = {
        name: websiteName,
        themeMode: themeMode.value,
        ...(themeColor && { themeColor: themeColor.value }),
        ...(backgroundColor && { backgroundColor: backgroundColor.value }),
      };
      return NextResponse.json(response);
    } catch (error) {
      logger.logErrorWithObject(error, 'Error getting website settings', {
        method: 'GET',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse('GET', '/api/settings', 500, duration);

      const errorResponse: SettingsErrorResponse = {
        error: 'Internal server error',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  }
);

export const POST = withApi(
  async (
    request: NextRequest
  ): Promise<NextResponse<UpdateSettingsResponse | SettingsErrorResponse>> => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'POST',
        '/api/settings',
        request.headers.get('x-user-id') || undefined
      );

      // Parse request body
      const body = (await request.json()) as UpdateSettingsRequest;
      const { name, themeColor, backgroundColor, themeMode } = body;

      // Validate inputs
      if (name && typeof name !== 'string') {
        logger.warn('Invalid name provided', { name });

        const duration = Date.now() - startTime;
        logger.logApiResponse('POST', '/api/settings', 400, duration);

        const errorResponse: SettingsErrorResponse = {
          error: 'Invalid name provided',
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      if (themeColor && !isValidThemeColor(themeColor)) {
        logger.warn('Invalid theme color provided', {
          themeColor,
        });

        const duration = Date.now() - startTime;
        logger.logApiResponse('POST', '/api/settings', 400, duration);

        const errorResponse: SettingsErrorResponse = {
          error: getThemeColorErrorMessage(),
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      if (backgroundColor && !isValidThemeColor(backgroundColor)) {
        logger.warn('Invalid background color provided', {
          backgroundColor,
        });

        const duration = Date.now() - startTime;
        logger.logApiResponse('POST', '/api/settings', 400, duration);

        const errorResponse: SettingsErrorResponse = {
          error:
            'Invalid background color provided. Must be one of: blue, red, green, purple, orange, teal, pink, cyan',
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      if (themeMode && !ThemeModePreference.isValid(themeMode)) {
        logger.warn('Invalid theme mode provided', {
          themeMode,
        });

        const duration = Date.now() - startTime;
        logger.logApiResponse('POST', '/api/settings', 400, duration);

        const errorResponse: SettingsErrorResponse = {
          error:
            'Invalid theme mode provided. Must be one of: force-light, force-dark, user-choice',
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      // Update name if provided
      if (name && typeof name === 'string') {
        const updateWebsiteName = SettingsServiceLocator.getUpdateWebsiteName();
        await updateWebsiteName.execute({ name });
        logger.info('Website name updated successfully', { name });
      }

      // Update theme color if provided
      if (themeColor && typeof themeColor === 'string') {
        const updateThemeColor = SettingsServiceLocator.getUpdateThemeColor();
        const themeColorValue = ThemeColor.create(themeColor);
        await updateThemeColor.execute(themeColorValue);
        logger.info('Theme color updated successfully', {
          newThemeColor: themeColorValue.value,
        });
      }

      // Update background color if provided
      if (backgroundColor && typeof backgroundColor === 'string') {
        const updateBackgroundColor =
          SettingsServiceLocator.getUpdateBackgroundColor();
        const backgroundColorValue = BackgroundColor.create(backgroundColor);
        await updateBackgroundColor.execute(backgroundColorValue);
        logger.info('Background color updated successfully', {
          newBackgroundColor: backgroundColorValue.value,
        });
      }

      // Update theme mode if provided
      if (themeMode && typeof themeMode === 'string') {
        const updateThemeMode = SettingsServiceLocator.getUpdateThemeMode();
        const themeModeValue = ThemeModePreference.create(themeMode);
        await updateThemeMode.execute(themeModeValue);
        logger.info('Theme mode updated successfully', {
          newThemeMode: themeModeValue.value,
        });
      }

      const duration = Date.now() - startTime;
      logger.logApiResponse('POST', '/api/settings', 200, duration, {
        name,
        themeColor,
        backgroundColor,
        themeMode,
      });

      const response: UpdateSettingsResponse = {
        message: 'Website settings updated successfully',
      };
      return NextResponse.json(response);
    } catch (error) {
      logger.logErrorWithObject(error, 'Error updating website settings', {
        method: 'POST',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse('POST', '/api/settings', 500, duration);

      const errorResponse: SettingsErrorResponse = {
        error: 'Internal server error',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  },
  { requireAuth: true }
);
