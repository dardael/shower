import { NextRequest, NextResponse } from 'next/server';
import type { IFileStorageService } from '@/infrastructure/shared/services/FileStorageService';
import { HeaderLogo } from '@/domain/settings/value-objects/HeaderLogo';
import { SettingsServiceLocator } from '@/infrastructure/container';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { withApi } from '@/infrastructure/shared/apiWrapper';

export const GET = withApi(async () => {
  try {
    const getHeaderLogo = SettingsServiceLocator.getHeaderLogo();
    const logo = await getHeaderLogo.execute();

    if (!logo) {
      return NextResponse.json({ logo: null });
    }

    return NextResponse.json({
      logo: {
        url: logo.url,
        filename: logo.filename,
        originalName: logo.originalName,
        size: logo.size,
        format: logo.format,
        mimeType: logo.mimeType,
        uploadedAt: logo.uploadedAt,
      },
    });
  } catch (error) {
    const logger = container.resolve<Logger>('Logger');
    logger.logErrorWithObject(error, 'Error getting header logo', {
      method: 'GET',
    });
    return NextResponse.json({ logo: null }, { status: 200 });
  }
});

export const POST = withApi(
  async (request: NextRequest) => {
    try {
      const formData = await request.formData();
      const file = formData.get('logo') as File;

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/svg+xml',
        'image/gif',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            error:
              'Invalid file type. Only PNG, JPG, SVG, GIF, and WebP formats are allowed.',
          },
          { status: 400 }
        );
      }

      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size too large. Maximum size is 2MB.' },
          { status: 400 }
        );
      }

      const getHeaderLogo = SettingsServiceLocator.getHeaderLogo();
      const currentLogo = await getHeaderLogo.execute();

      if (currentLogo) {
        const fileStorageService = container.resolve<IFileStorageService>(
          'IFileStorageService'
        );
        await fileStorageService.deleteLogo(currentLogo.filename);
      }

      const fileStorageService = container.resolve<IFileStorageService>(
        'IFileStorageService'
      );
      const { url, metadata } = await fileStorageService.uploadLogo(file);

      const logo = new HeaderLogo(url, metadata);

      const updateHeaderLogo = SettingsServiceLocator.getUpdateHeaderLogo();
      await updateHeaderLogo.execute(logo);

      return NextResponse.json({
        message: 'Header logo updated successfully',
        logo: {
          url: logo.url,
          filename: logo.filename,
          originalName: logo.originalName,
          size: logo.size,
          format: logo.format,
          mimeType: logo.mimeType,
          uploadedAt: logo.uploadedAt,
        },
      });
    } catch (error) {
      const logger = container.resolve<Logger>('Logger');
      logger.logErrorWithObject(error, 'Error updating header logo', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      return NextResponse.json(
        { error: 'Failed to update header logo. Please try again later.' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);

export const DELETE = withApi(
  async () => {
    try {
      const getHeaderLogo = SettingsServiceLocator.getHeaderLogo();
      const currentLogo = await getHeaderLogo.execute();

      if (currentLogo) {
        const fileStorageService = container.resolve<IFileStorageService>(
          'IFileStorageService'
        );
        await fileStorageService.deleteLogo(currentLogo.filename);
      }

      const updateHeaderLogo = SettingsServiceLocator.getUpdateHeaderLogo();
      await updateHeaderLogo.execute(null);

      return NextResponse.json({
        message: 'Header logo removed successfully',
      });
    } catch (error) {
      const logger = container.resolve<Logger>('Logger');
      logger.logErrorWithObject(error, 'Error removing header logo', {
        error,
      });
      return NextResponse.json(
        { error: 'Failed to remove header logo. Please try again later.' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);
