import { NextRequest, NextResponse } from 'next/server';
import { SettingsServiceLocator } from '@/infrastructure/container';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { withApi } from '@/infrastructure/shared/apiWrapper';

export const GET = withApi(async (request: NextRequest) => {
  const startTime = Date.now();
  const logger = container.resolve<Logger>('Logger');

  try {
    logger.logApiRequest(
      'GET',
      '/api/settings/name',
      request.headers.get('x-user-id') || undefined
    );

    // Get website name through application layer
    const getWebsiteName = SettingsServiceLocator.getWebsiteName();
    const name = await getWebsiteName.execute();

    logger.info('Website name retrieved successfully', { name });

    const duration = Date.now() - startTime;
    logger.logApiResponse('GET', '/api/settings/name', 200, duration, {
      name,
    });

    return NextResponse.json({ name });
  } catch (error) {
    logger.logErrorWithObject(error, 'Error getting website name', {
      method: 'GET',
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    const duration = Date.now() - startTime;
    logger.logApiResponse('GET', '/api/settings/name', 500, duration);

    return NextResponse.json(
      { error: 'Failed to retrieve website name. Please try again later.' },
      { status: 500 }
    );
  }
});

export const POST = withApi(
  async (request: NextRequest) => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'POST',
        '/api/settings/name',
        request.headers.get('x-user-id') || undefined
      );

      // Parse request body with enhanced error handling
      let body: { name: string };
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
        logger.logApiResponse('POST', '/api/settings/name', 400, duration);

        return NextResponse.json(
          {
            error:
              'Invalid request format. Please ensure your request contains valid JSON.',
          },
          { status: 400 }
        );
      }

      const { name } = body;

      // Validate name
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        logger.warn('Invalid name provided', { name });

        const duration = Date.now() - startTime;
        logger.logApiResponse('POST', '/api/settings/name', 400, duration);

        return NextResponse.json(
          { error: 'Website name is required and must be a non-empty string.' },
          { status: 400 }
        );
      }

      if (name.length > 50) {
        logger.warn('Website name exceeds maximum length', { name });

        const duration = Date.now() - startTime;
        logger.logApiResponse('POST', '/api/settings/name', 400, duration);

        return NextResponse.json(
          { error: 'Website name cannot exceed 50 characters.' },
          { status: 400 }
        );
      }

      // Update website name
      const updateWebsiteName = SettingsServiceLocator.getUpdateWebsiteName();
      await updateWebsiteName.execute({ name: name.trim() });

      logger.info('Website name updated successfully', { name: name.trim() });

      const duration = Date.now() - startTime;
      logger.logApiResponse('POST', '/api/settings/name', 200, duration, {
        name: name.trim(),
      });

      return NextResponse.json({
        message: 'Website name updated successfully',
        name: name.trim(),
      });
    } catch (error) {
      logger.logErrorWithObject(error, 'Error updating website name', {
        method: 'POST',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse('POST', '/api/settings/name', 500, duration);

      return NextResponse.json(
        { error: 'Failed to update website name. Please try again later.' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);
