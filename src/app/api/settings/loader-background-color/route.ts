import { NextRequest, NextResponse } from 'next/server';
import { SettingsServiceLocator } from '@/infrastructure/container';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { LoaderBackgroundColor } from '@/domain/settings/value-objects/LoaderBackgroundColor';
import type {
  GetLoaderBackgroundColorResponse,
  UpdateLoaderBackgroundColorRequest,
  UpdateLoaderBackgroundColorResponse,
  LoaderBackgroundColorErrorResponse,
} from './types';

export const GET = withApi(
  async (
    request: NextRequest
  ): Promise<
    NextResponse<
      GetLoaderBackgroundColorResponse | LoaderBackgroundColorErrorResponse
    >
  > => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'GET',
        '/api/settings/loader-background-color',
        request.headers.get('x-user-id') || undefined
      );

      const getLoaderBackgroundColor =
        SettingsServiceLocator.getGetLoaderBackgroundColor();
      const loaderBackgroundColor = await getLoaderBackgroundColor.execute();

      const colorValue = loaderBackgroundColor?.toString() ?? null;
      const etag = `"loader-background-color-${colorValue ?? 'default'}"`;
      const ifNoneMatch = request.headers.get('if-none-match');

      if (ifNoneMatch === etag) {
        const duration = Date.now() - startTime;
        logger.logApiResponse(
          'GET',
          '/api/settings/loader-background-color',
          304,
          duration,
          { cached: true }
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

      logger.info(
        'Couleur de fond du chargeur récupérée avec succès',
        colorValue ? { value: colorValue } : { value: 'default' }
      );

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'GET',
        '/api/settings/loader-background-color',
        200,
        duration,
        { value: colorValue }
      );

      const response: GetLoaderBackgroundColorResponse = {
        value: colorValue,
      };
      return NextResponse.json(response, {
        headers: {
          'Cache-Control':
            'public, max-age=1800, stale-while-revalidate=3600, immutable',
          ETag: etag,
        },
      });
    } catch (error) {
      logger.logErrorWithObject(
        error,
        'Erreur lors de la récupération de la couleur de fond du chargeur',
        {
          method: 'GET',
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'GET',
        '/api/settings/loader-background-color',
        500,
        duration
      );

      const errorResponse: LoaderBackgroundColorErrorResponse = {
        error:
          'Échec de la récupération de la couleur de fond. Veuillez réessayer plus tard.',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  }
);

export const POST = withApi(
  async (
    request: NextRequest
  ): Promise<
    NextResponse<
      UpdateLoaderBackgroundColorResponse | LoaderBackgroundColorErrorResponse
    >
  > => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'POST',
        '/api/settings/loader-background-color',
        request.headers.get('x-user-id') || undefined
      );

      let body: UpdateLoaderBackgroundColorRequest;
      try {
        body = await request.json();
      } catch (parseError) {
        logger.warn('JSON invalide dans le corps de la requête', {
          method: 'POST',
          error:
            parseError instanceof Error
              ? parseError.message
              : 'Unknown parsing error',
        });

        const duration = Date.now() - startTime;
        logger.logApiResponse(
          'POST',
          '/api/settings/loader-background-color',
          400,
          duration
        );

        const errorResponse: LoaderBackgroundColorErrorResponse = {
          error:
            'Format de requête invalide. Veuillez vous assurer que votre requête contient un JSON valide.',
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      const { value } = body;

      // Allow null to reset to default
      if (value !== null && !LoaderBackgroundColor.isValid(value)) {
        logger.warn('Format de couleur invalide fourni', {
          value,
          valueType: typeof value,
        });

        const duration = Date.now() - startTime;
        logger.logApiResponse(
          'POST',
          '/api/settings/loader-background-color',
          400,
          duration
        );

        const errorResponse: LoaderBackgroundColorErrorResponse = {
          error:
            'Format de couleur invalide. Veuillez fournir une couleur hexadécimale valide (ex: #FFFFFF).',
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      const setLoaderBackgroundColor =
        SettingsServiceLocator.getSetLoaderBackgroundColor();
      const loaderBackgroundColor =
        value !== null ? LoaderBackgroundColor.create(value) : null;

      await setLoaderBackgroundColor.execute(loaderBackgroundColor);

      const colorValue = loaderBackgroundColor?.toString() ?? null;
      logger.info('Couleur de fond du chargeur mise à jour avec succès', {
        newValue: colorValue ?? 'default',
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'POST',
        '/api/settings/loader-background-color',
        200,
        duration,
        { value: colorValue }
      );

      const response: UpdateLoaderBackgroundColorResponse = {
        success: true,
        value: colorValue,
      };
      return NextResponse.json(response, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'X-Cache-Invalidate': 'loader-background-color',
        },
      });
    } catch (error) {
      logger.logErrorWithObject(
        error,
        'Erreur lors de la mise à jour de la couleur de fond du chargeur',
        {
          method: 'POST',
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'POST',
        '/api/settings/loader-background-color',
        500,
        duration
      );

      const errorResponse: LoaderBackgroundColorErrorResponse = {
        error:
          'Échec de la mise à jour de la couleur de fond. Veuillez réessayer plus tard.',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  },
  { requireAuth: true }
);

export const DELETE = withApi(
  async (
    request: NextRequest
  ): Promise<
    NextResponse<
      UpdateLoaderBackgroundColorResponse | LoaderBackgroundColorErrorResponse
    >
  > => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'DELETE',
        '/api/settings/loader-background-color',
        request.headers.get('x-user-id') || undefined
      );

      const setLoaderBackgroundColor =
        SettingsServiceLocator.getSetLoaderBackgroundColor();

      await setLoaderBackgroundColor.execute(null);

      logger.info(
        'Couleur de fond du chargeur réinitialisée à la valeur par défaut'
      );

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'DELETE',
        '/api/settings/loader-background-color',
        200,
        duration,
        { value: null }
      );

      const response: UpdateLoaderBackgroundColorResponse = {
        success: true,
        value: null,
      };
      return NextResponse.json(response, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'X-Cache-Invalidate': 'loader-background-color',
        },
      });
    } catch (error) {
      logger.logErrorWithObject(
        error,
        'Erreur lors de la réinitialisation de la couleur de fond du chargeur',
        {
          method: 'DELETE',
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'DELETE',
        '/api/settings/loader-background-color',
        500,
        duration
      );

      const errorResponse: LoaderBackgroundColorErrorResponse = {
        error:
          'Échec de la réinitialisation de la couleur de fond. Veuillez réessayer plus tard.',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  },
  { requireAuth: true }
);
