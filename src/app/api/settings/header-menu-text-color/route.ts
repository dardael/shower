import { NextRequest, NextResponse } from 'next/server';
import { SettingsServiceLocator } from '@/infrastructure/container';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { HeaderMenuTextColor } from '@/domain/settings/value-objects/HeaderMenuTextColor';
import type {
  GetHeaderMenuTextColorResponse,
  UpdateHeaderMenuTextColorRequest,
  UpdateHeaderMenuTextColorResponse,
  HeaderMenuTextColorErrorResponse,
} from './types';

export const GET = withApi(
  async (
    request: NextRequest
  ): Promise<
    NextResponse<
      GetHeaderMenuTextColorResponse | HeaderMenuTextColorErrorResponse
    >
  > => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'GET',
        '/api/settings/header-menu-text-color',
        request.headers.get('x-user-id') || undefined
      );

      const getHeaderMenuTextColor =
        SettingsServiceLocator.getGetHeaderMenuTextColor();
      const headerMenuTextColor = await getHeaderMenuTextColor.execute();

      const etag = `"header-menu-text-color-${headerMenuTextColor.toString()}"`;
      const ifNoneMatch = request.headers.get('if-none-match');

      if (ifNoneMatch === etag) {
        const duration = Date.now() - startTime;
        logger.logApiResponse(
          'GET',
          '/api/settings/header-menu-text-color',
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

      logger.info('Couleur du texte du menu récupérée avec succès', {
        value: headerMenuTextColor.toString(),
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'GET',
        '/api/settings/header-menu-text-color',
        200,
        duration,
        { value: headerMenuTextColor.toString() }
      );

      const response: GetHeaderMenuTextColorResponse = {
        value: headerMenuTextColor.toString(),
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
        'Erreur lors de la récupération de la couleur du texte du menu',
        {
          method: 'GET',
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'GET',
        '/api/settings/header-menu-text-color',
        500,
        duration
      );

      const errorResponse: HeaderMenuTextColorErrorResponse = {
        error:
          'Échec de la récupération de la couleur du texte. Veuillez réessayer plus tard.',
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
      UpdateHeaderMenuTextColorResponse | HeaderMenuTextColorErrorResponse
    >
  > => {
    const startTime = Date.now();
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'POST',
        '/api/settings/header-menu-text-color',
        request.headers.get('x-user-id') || undefined
      );

      let body: UpdateHeaderMenuTextColorRequest;
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
          '/api/settings/header-menu-text-color',
          400,
          duration
        );

        const errorResponse: HeaderMenuTextColorErrorResponse = {
          error:
            'Format de requête invalide. Veuillez vous assurer que votre requête contient un JSON valide.',
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      const { value } = body;

      if (!HeaderMenuTextColor.isValid(value)) {
        logger.warn('Format de couleur invalide fourni', {
          value,
          valueType: typeof value,
        });

        const duration = Date.now() - startTime;
        logger.logApiResponse(
          'POST',
          '/api/settings/header-menu-text-color',
          400,
          duration
        );

        const errorResponse: HeaderMenuTextColorErrorResponse = {
          error:
            'Format de couleur invalide. Veuillez fournir une couleur hexadécimale valide (ex: #000000).',
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      const updateHeaderMenuTextColor =
        SettingsServiceLocator.getUpdateHeaderMenuTextColor();
      const headerMenuTextColor = HeaderMenuTextColor.create(value);

      await updateHeaderMenuTextColor.execute(headerMenuTextColor);

      logger.info('Couleur du texte du menu mise à jour avec succès', {
        newValue: headerMenuTextColor.toString(),
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'POST',
        '/api/settings/header-menu-text-color',
        200,
        duration,
        { value: headerMenuTextColor.toString() }
      );

      const response: UpdateHeaderMenuTextColorResponse = {
        success: true,
        value: headerMenuTextColor.toString(),
      };
      return NextResponse.json(response, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'X-Cache-Invalidate': 'header-menu-text-color',
        },
      });
    } catch (error) {
      logger.logErrorWithObject(
        error,
        'Erreur lors de la mise à jour de la couleur du texte du menu',
        {
          method: 'POST',
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );

      const duration = Date.now() - startTime;
      logger.logApiResponse(
        'POST',
        '/api/settings/header-menu-text-color',
        500,
        duration
      );

      const errorResponse: HeaderMenuTextColorErrorResponse = {
        error:
          'Échec de la mise à jour de la couleur du texte. Veuillez réessayer plus tard.',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  },
  { requireAuth: true }
);
