import { NextRequest, NextResponse } from 'next/server';
import type { IFileStorageService } from '@/infrastructure/shared/services/FileStorageService';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import { SettingsServiceLocator } from '@/infrastructure/container';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { withApi } from '@/infrastructure/shared/apiWrapper';

export const GET = withApi(async () => {
  try {
    // Get website icon through application layer
    const getWebsiteIcon = SettingsServiceLocator.getWebsiteIcon();
    const icon = await getWebsiteIcon.execute();

    if (!icon) {
      return NextResponse.json({ icon: null });
    }

    return NextResponse.json({
      icon: {
        url: icon.url,
        filename: icon.filename,
        originalName: icon.originalName,
        size: icon.size,
        format: icon.format,
        mimeType: icon.mimeType,
        uploadedAt: icon.uploadedAt,
      },
    });
  } catch (error) {
    const logger = container.resolve<Logger>('Logger');
    logger.logErrorWithObject(error, 'Error getting website icon', {
      method: 'GET',
    });
    return NextResponse.json({ icon: null }, { status: 200 }); // Return null on error
  }
});

export const POST = withApi(
  async (request: NextRequest) => {
    try {
      // Parse form data for file upload
      const formData = await request.formData();
      const file = formData.get('icon') as File;

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = [
        'image/x-icon',
        'image/vnd.microsoft.icon',
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
              'Invalid file type. Only ICO, PNG, JPG, SVG, GIF, and WebP formats are allowed.',
          },
          { status: 400 }
        );
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size too large. Maximum size is 10MB.' },
          { status: 400 }
        );
      }

      // Upload file using storage service
      const fileStorageService = container.resolve<IFileStorageService>(
        'IFileStorageService'
      );
      const { url, metadata } = await fileStorageService.uploadIcon(file);

      // Create WebsiteIcon value object
      const icon = new WebsiteIcon(url, metadata);

      // Update website icon through application layer
      const updateWebsiteIcon = SettingsServiceLocator.getUpdateWebsiteIcon();
      await updateWebsiteIcon.execute(icon);

      return NextResponse.json({
        message: 'Website icon updated successfully',
        icon: {
          url: icon.url,
          filename: icon.filename,
          originalName: icon.originalName,
          size: icon.size,
          format: icon.format,
          mimeType: icon.mimeType,
          uploadedAt: icon.uploadedAt,
        },
      });
    } catch (error) {
      const logger = container.resolve<Logger>('Logger');
      logger.logErrorWithObject(error, 'Error updating website icon', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      return NextResponse.json(
        { error: 'Failed to update website icon. Please try again later.' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);

export const DELETE = withApi(
  async () => {
    try {
      // Get current icon to delete file
      const getWebsiteIcon = SettingsServiceLocator.getWebsiteIcon();
      const currentIcon = await getWebsiteIcon.execute();

      if (currentIcon) {
        // Delete file from storage
        const fileStorageService = container.resolve<IFileStorageService>(
          'IFileStorageService'
        );
        await fileStorageService.deleteIcon(currentIcon.filename);
      }

      // Remove icon from database
      const updateWebsiteIcon = SettingsServiceLocator.getUpdateWebsiteIcon();
      await updateWebsiteIcon.execute(null);

      return NextResponse.json({
        message: 'Website icon removed successfully',
      });
    } catch (error) {
      const logger = container.resolve<Logger>('Logger');
      logger.logErrorWithObject(error, 'Error removing website icon', {
        error,
      });
      return NextResponse.json(
        { error: 'Failed to remove website icon. Please try again later.' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);
