import { NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

interface PublicLoaderResponse {
  loader: {
    type: 'gif' | 'video';
    url: string;
  } | null;
}

interface ErrorResponse {
  error: string;
}

export async function GET(): Promise<
  NextResponse<PublicLoaderResponse | ErrorResponse>
> {
  const logger = container.resolve<Logger>('Logger');

  try {
    const settingsRepository = container.resolve<WebsiteSettingsRepository>(
      'WebsiteSettingsRepository'
    );

    const setting = await settingsRepository.getByKey(
      VALID_SETTING_KEYS.CUSTOM_LOADER
    );

    const loaderValue = setting.getValueAsCustomLoader();

    if (!loaderValue) {
      return NextResponse.json({ loader: null });
    }

    return NextResponse.json({
      loader: {
        type: loaderValue.metadata.type,
        url: loaderValue.url,
      },
    });
  } catch (error) {
    logger.logErrorWithObject(error, 'Error getting public loader', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json({ loader: null });
  }
}
