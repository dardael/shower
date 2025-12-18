import { NextRequest, NextResponse } from 'next/server';
import { ConfigServiceLocator } from '@/infrastructure/container';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { ScheduledRestartConfig } from '@/domain/config/value-objects/ScheduledRestartConfig';
import type {
  ScheduledRestartConfigResponse,
  UpdateScheduledRestartRequest,
  UpdateScheduledRestartResponse,
  ScheduledRestartErrorResponse,
} from './types';

export const GET = withApi(
  async (
    request: NextRequest
  ): Promise<
    NextResponse<ScheduledRestartConfigResponse | ScheduledRestartErrorResponse>
  > => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'GET',
        '/api/admin/scheduled-restart',
        request.headers.get('x-user-id') || undefined
      );

      const getScheduledRestartConfig =
        ConfigServiceLocator.getGetScheduledRestartConfig();
      const config = await getScheduledRestartConfig.execute();

      logger.info('Scheduled restart config retrieved successfully', {
        enabled: config.enabled,
        restartHour: config.restartHour,
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'GET',
        '/api/admin/scheduled-restart',
        200,
        duration,
        {
          enabled: config.enabled,
          restartHour: config.restartHour,
        }
      );

      const response: ScheduledRestartConfigResponse = {
        enabled: config.enabled,
        restartHour: config.restartHour,
      };
      return NextResponse.json(response);
    } catch (error) {
      logger.logErrorWithObject(
        error,
        'Error getting scheduled restart config',
        {
          method: 'GET',
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'GET',
        '/api/admin/scheduled-restart',
        500,
        duration
      );

      const errorResponse: ScheduledRestartErrorResponse = {
        error:
          'Failed to retrieve scheduled restart configuration. Please try again later.',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  },
  { requireAuth: true }
);

export const POST = withApi(
  async (
    request: NextRequest
  ): Promise<
    NextResponse<UpdateScheduledRestartResponse | ScheduledRestartErrorResponse>
  > => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'POST',
        '/api/admin/scheduled-restart',
        request.headers.get('x-user-id') || undefined
      );

      let body: UpdateScheduledRestartRequest;
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
          '/api/admin/scheduled-restart',
          400,
          duration
        );

        const errorResponse: ScheduledRestartErrorResponse = {
          error:
            'Invalid request format. Please ensure your request contains valid JSON.',
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      const { enabled, restartHour } = body;

      // Validate enabled is a boolean
      if (typeof enabled !== 'boolean') {
        logger.warn('Invalid enabled value provided', {
          enabled,
          enabledType: typeof enabled,
        });

        const duration = Date.now() - startTime;
        logger.logApiResponse(
          'POST',
          '/api/admin/scheduled-restart',
          400,
          duration
        );

        const errorResponse: ScheduledRestartErrorResponse = {
          error: 'Invalid enabled value. Must be a boolean.',
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      // Validate restartHour is a valid hour (0-23)
      if (
        typeof restartHour !== 'number' ||
        !Number.isInteger(restartHour) ||
        restartHour < 0 ||
        restartHour > 23
      ) {
        logger.warn('Invalid restart hour provided', {
          restartHour,
          restartHourType: typeof restartHour,
        });

        const duration = Date.now() - startTime;
        logger.logApiResponse(
          'POST',
          '/api/admin/scheduled-restart',
          400,
          duration
        );

        const errorResponse: ScheduledRestartErrorResponse = {
          error: 'Invalid restart hour. Must be an integer between 0 and 23.',
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      const updateScheduledRestartConfig =
        ConfigServiceLocator.getUpdateScheduledRestartConfig();
      const config = ScheduledRestartConfig.create({ enabled, restartHour });

      await updateScheduledRestartConfig.execute(config);

      // Reschedule the restart with the new configuration
      const scheduler = ConfigServiceLocator.getRestartScheduler();
      scheduler.schedule(config);

      logger.info('Scheduled restart config updated successfully', {
        enabled: config.enabled,
        restartHour: config.restartHour,
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'POST',
        '/api/admin/scheduled-restart',
        200,
        duration,
        {
          enabled: config.enabled,
          restartHour: config.restartHour,
        }
      );

      const response: UpdateScheduledRestartResponse = {
        message: 'Scheduled restart configuration updated successfully',
        enabled: config.enabled,
        restartHour: config.restartHour,
      };
      return NextResponse.json(response);
    } catch (error) {
      logger.logErrorWithObject(
        error,
        'Error updating scheduled restart config',
        {
          method: 'POST',
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'POST',
        '/api/admin/scheduled-restart',
        500,
        duration
      );

      const errorResponse: ScheduledRestartErrorResponse = {
        error:
          'Failed to update scheduled restart configuration. Please try again later.',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  },
  { requireAuth: true }
);
