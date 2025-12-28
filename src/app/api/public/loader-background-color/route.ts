import { NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';
import { LoaderBackgroundColor } from '@/domain/settings/value-objects/LoaderBackgroundColor';

export interface GetPublicLoaderBackgroundColorResponse {
  value: string | null;
}

export async function GET(): Promise<
  NextResponse<GetPublicLoaderBackgroundColorResponse>
> {
  const logger = container.resolve<Logger>('Logger');

  try {
    const repository = container.resolve<WebsiteSettingsRepository>(
      'WebsiteSettingsRepository'
    );

    const setting = await repository.getByKey(
      VALID_SETTING_KEYS.LOADER_BACKGROUND_COLOR
    );

    const value = setting?.value;

    if (typeof value === 'string' && LoaderBackgroundColor.isValid(value)) {
      return NextResponse.json(
        { value },
        {
          headers: {
            'Cache-Control':
              'public, max-age=1800, stale-while-revalidate=3600',
          },
        }
      );
    }

    return NextResponse.json(
      { value: null },
      {
        headers: {
          'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    logger.logErrorWithObject(
      error,
      'Erreur lors de la récupération de la couleur de fond du chargeur (public)',
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    );

    return NextResponse.json(
      { value: null },
      {
        headers: {
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
  }
}
