import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';
import type { IFileStorageService } from '@/infrastructure/shared/services/FileStorageService';
import { Logger } from '@/application/shared/Logger';
import { withApiParams } from '@/infrastructure/shared/apiWrapper';

interface RouteParams {
  menuItemId: string;
}

/**
 * PUT /api/settings/pages/[menuItemId]/hero-media
 * Upload hero media (image or video) for a specific page
 */
export const PUT = withApiParams<RouteParams, NextResponse>(
  async (request: NextRequest, { params }) => {
    const logger = container.resolve<Logger>('Logger');
    const { menuItemId } = await params;

    try {
      const pageContentRepository = container.resolve<IPageContentRepository>(
        'PageContentRepository'
      );
      const fileStorageService = container.resolve<IFileStorageService>(
        'IFileStorageService'
      );

      const existingContent =
        await pageContentRepository.findByMenuItemId(menuItemId);

      if (!existingContent) {
        return NextResponse.json(
          { error: 'Page content not found' },
          { status: 404 }
        );
      }

      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      // Delete existing hero media if present
      if (existingContent.heroMediaUrl) {
        try {
          await fileStorageService.deleteHeroMedia(
            existingContent.heroMediaUrl.split('/').pop() || ''
          );
        } catch (deleteError) {
          logger.warn('Failed to delete existing hero media', {
            error: deleteError,
          });
        }
      }

      // Upload new hero media
      const { url, metadata } = await fileStorageService.uploadHeroMedia(file);

      // Update page content with hero media
      const updatedContent = existingContent.withHero(
        url,
        metadata.type,
        existingContent.heroText || null
      );

      await pageContentRepository.save(updatedContent);

      return NextResponse.json({
        heroMediaUrl: url,
        heroMediaType: metadata.type,
      });
    } catch (error) {
      logger.logErrorWithObject(error, 'Failed to upload hero media for page', {
        menuItemId,
      });
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : 'Failed to upload hero media',
        },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);

/**
 * DELETE /api/settings/pages/[menuItemId]/hero-media
 * Remove hero media for a specific page
 */
export const DELETE = withApiParams<RouteParams, NextResponse>(
  async (_request: NextRequest, { params }) => {
    const logger = container.resolve<Logger>('Logger');
    const { menuItemId } = await params;

    try {
      const pageContentRepository = container.resolve<IPageContentRepository>(
        'PageContentRepository'
      );
      const fileStorageService = container.resolve<IFileStorageService>(
        'IFileStorageService'
      );

      const existingContent =
        await pageContentRepository.findByMenuItemId(menuItemId);

      if (!existingContent) {
        return NextResponse.json(
          { error: 'Page content not found' },
          { status: 404 }
        );
      }

      // Delete hero media file if it exists
      if (existingContent.heroMediaUrl) {
        try {
          await fileStorageService.deleteHeroMedia(
            existingContent.heroMediaUrl.split('/').pop() || ''
          );
        } catch (deleteError) {
          logger.warn('Failed to delete hero media file', {
            error: deleteError,
          });
        }
      }

      // Clear hero data on the page content
      const updatedContent = existingContent.withHero(null, null, null);
      await pageContentRepository.save(updatedContent);

      return NextResponse.json({ success: true });
    } catch (error) {
      logger.logErrorWithObject(error, 'Failed to delete hero media for page', {
        menuItemId,
      });
      return NextResponse.json(
        { error: 'Failed to delete hero media' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);
