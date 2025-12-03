import { NextRequest, NextResponse } from 'next/server';
import type { IFileStorageService } from '@/infrastructure/shared/services/FileStorageService';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';

export const POST = withApi(
  async (request: NextRequest) => {
    try {
      const formData = await request.formData();
      const file = formData.get('image') as File | null;

      if (!file) {
        return NextResponse.json(
          { error: 'No image file provided.' },
          { status: 400 }
        );
      }

      const fileStorageService = container.resolve<IFileStorageService>(
        'IFileStorageService'
      );
      const { url, metadata } =
        await fileStorageService.uploadPageContentImage(file);

      return NextResponse.json(
        {
          message: 'Image uploaded successfully',
          image: {
            url,
            filename: metadata.filename,
            originalName: metadata.originalName,
            size: metadata.size,
            format: metadata.format,
            mimeType: metadata.mimeType,
            uploadedAt: metadata.uploadedAt.toISOString(),
          },
        },
        { status: 201 }
      );
    } catch (error) {
      const logger = container.resolve<Logger>('Logger');
      logger.logErrorWithObject(error, 'Failed to upload page content image');

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload image';

      // Check if it's a validation error (file type or size)
      if (
        errorMessage.includes('Invalid file type') ||
        errorMessage.includes('File size')
      ) {
        return NextResponse.json({ error: errorMessage }, { status: 400 });
      }

      return NextResponse.json(
        { error: 'Failed to upload image. Please try again.' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);
