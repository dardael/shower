import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { IFileStorageService } from '@/infrastructure/shared/services/FileStorageService';
import { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteSetting } from '@/domain/settings/entities/WebsiteSetting';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

interface CustomLoaderResponse {
  loader: {
    url: string;
    metadata: {
      type: 'gif' | 'video';
      filename: string;
      mimeType: string;
      size: number;
      uploadedAt: string;
    };
  } | null;
}

interface ErrorResponse {
  error: string;
}

export const GET = withApi(
  async (
    request: NextRequest
  ): Promise<NextResponse<CustomLoaderResponse | ErrorResponse>> => {
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'GET',
        '/api/settings/loader',
        request.headers.get('x-user-id') || undefined
      );

      const settingsRepository = container.resolve<WebsiteSettingsRepository>(
        'WebsiteSettingsRepository'
      );

      const setting = await settingsRepository.getByKey(
        VALID_SETTING_KEYS.CUSTOM_LOADER
      );

      const loaderValue = setting.getValueAsCustomLoader();

      return NextResponse.json({ loader: loaderValue });
    } catch (error) {
      logger.logErrorWithObject(error, 'Error getting custom loader setting', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);

export const PUT = withApi(
  async (
    request: NextRequest
  ): Promise<NextResponse<CustomLoaderResponse | ErrorResponse>> => {
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'PUT',
        '/api/settings/loader',
        request.headers.get('x-user-id') || undefined
      );

      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      const fileStorageService = container.resolve<IFileStorageService>(
        'IFileStorageService'
      );
      const settingsRepository = container.resolve<WebsiteSettingsRepository>(
        'WebsiteSettingsRepository'
      );

      // Delete existing loader file if present
      try {
        const existingSetting = await settingsRepository.getByKey(
          VALID_SETTING_KEYS.CUSTOM_LOADER
        );
        const existingLoader = existingSetting.getValueAsCustomLoader();
        if (existingLoader) {
          try {
            await fileStorageService.deleteCustomLoader(
              existingLoader.metadata.filename
            );
          } catch (deleteError) {
            logger.warn('Failed to delete existing loader file', {
              filename: existingLoader.metadata.filename,
              error: deleteError,
            });
          }
        }
      } catch {
        // No existing loader, continue
      }

      // Upload new file
      const { url, metadata } =
        await fileStorageService.uploadCustomLoader(file);

      // Save setting
      const setting = WebsiteSetting.createCustomLoader(url, metadata);
      await settingsRepository.setByKey(
        VALID_SETTING_KEYS.CUSTOM_LOADER,
        setting.value
      );

      logger.info('Custom loader uploaded successfully', {
        filename: metadata.filename,
        type: metadata.type,
        size: metadata.size,
      });

      return NextResponse.json({
        loader: { url, metadata },
      });
    } catch (error) {
      logger.logErrorWithObject(error, 'Error uploading custom loader', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof Error) {
        if (
          error.message.includes('Invalid file type') ||
          error.message.includes('File size')
        ) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);

export const DELETE = withApi(
  async (
    request: NextRequest
  ): Promise<NextResponse<CustomLoaderResponse | ErrorResponse>> => {
    const logger = container.resolve<Logger>('Logger');

    try {
      logger.logApiRequest(
        'DELETE',
        '/api/settings/loader',
        request.headers.get('x-user-id') || undefined
      );

      const fileStorageService = container.resolve<IFileStorageService>(
        'IFileStorageService'
      );
      const settingsRepository = container.resolve<WebsiteSettingsRepository>(
        'WebsiteSettingsRepository'
      );

      // Get existing setting and delete file
      try {
        const existingSetting = await settingsRepository.getByKey(
          VALID_SETTING_KEYS.CUSTOM_LOADER
        );
        const existingLoader = existingSetting.getValueAsCustomLoader();
        if (existingLoader) {
          try {
            await fileStorageService.deleteCustomLoader(
              existingLoader.metadata.filename
            );
          } catch (deleteError) {
            logger.warn('Failed to delete loader file', {
              filename: existingLoader.metadata.filename,
              error: deleteError,
            });
          }
        }
      } catch {
        // No existing loader, continue
      }

      // Save null setting
      await settingsRepository.setByKey(VALID_SETTING_KEYS.CUSTOM_LOADER, null);

      logger.info('Custom loader deleted successfully');

      return NextResponse.json({ loader: null });
    } catch (error) {
      logger.logErrorWithObject(error, 'Error deleting custom loader', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);
