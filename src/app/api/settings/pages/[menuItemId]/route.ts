import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import type { GetPageContent } from '@/application/pages/use-cases/GetPageContent';
import type { UpdatePageContent } from '@/application/pages/use-cases/UpdatePageContent';
import type { DeletePageContent } from '@/application/pages/use-cases/DeletePageContent';
import { Logger } from '@/application/shared/Logger';
import { withApiParams } from '@/infrastructure/shared/apiWrapper';
import type { PageContentResponse } from '@/app/api/settings/pages/types';

interface RouteParams {
  menuItemId: string;
}

export const GET = withApiParams<RouteParams, NextResponse>(
  async (_request: NextRequest, { params }) => {
    const logger = container.resolve<Logger>('Logger');
    const { menuItemId } = await params;

    try {
      const getPageContent =
        container.resolve<GetPageContent>('IGetPageContent');
      const pageContent = await getPageContent.execute(menuItemId);

      if (!pageContent) {
        return NextResponse.json(
          { error: 'Page content not found' },
          { status: 404 }
        );
      }

      const response: PageContentResponse = {
        id: pageContent.id,
        menuItemId: pageContent.menuItemId,
        content: pageContent.content.value,
        heroMediaUrl: pageContent.heroMediaUrl,
        heroMediaType: pageContent.heroMediaType,
        heroText: pageContent.heroText,
        createdAt: pageContent.createdAt.toISOString(),
        updatedAt: pageContent.updatedAt.toISOString(),
      };

      return NextResponse.json(response);
    } catch (error) {
      logger.logErrorWithObject(error, 'Error fetching page content');
      return NextResponse.json(
        { error: 'Failed to fetch page content' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);

export const PATCH = withApiParams<RouteParams, NextResponse>(
  async (request: NextRequest, { params }) => {
    const logger = container.resolve<Logger>('Logger');
    const { menuItemId } = await params;

    try {
      const body = await request.json();
      const { content, heroText } = body;

      if (typeof content !== 'string') {
        return NextResponse.json(
          { error: 'Content is required and must be a string' },
          { status: 400 }
        );
      }

      const updatePageContent =
        container.resolve<UpdatePageContent>('IUpdatePageContent');
      const pageContent = await updatePageContent.execute(
        menuItemId,
        content,
        heroText !== undefined ? heroText : undefined
      );

      const response: PageContentResponse = {
        id: pageContent.id,
        menuItemId: pageContent.menuItemId,
        content: pageContent.content.value,
        heroMediaUrl: pageContent.heroMediaUrl,
        heroMediaType: pageContent.heroMediaType,
        heroText: pageContent.heroText,
        createdAt: pageContent.createdAt.toISOString(),
        updatedAt: pageContent.updatedAt.toISOString(),
      };

      return NextResponse.json(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Page content not found') {
          return NextResponse.json({ error: error.message }, { status: 404 });
        }
        if (
          error.message === 'Page content cannot be empty' ||
          error.message === 'Page content cannot exceed 100000 characters'
        ) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      }
      logger.logErrorWithObject(error, 'Error updating page content');
      return NextResponse.json(
        { error: 'Failed to update page content' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);

export const DELETE = withApiParams<RouteParams, NextResponse>(
  async (_request: NextRequest, { params }) => {
    const logger = container.resolve<Logger>('Logger');
    const { menuItemId } = await params;

    try {
      const deletePageContent =
        container.resolve<DeletePageContent>('IDeletePageContent');
      await deletePageContent.execute(menuItemId);

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Page content not found') {
          return NextResponse.json({ error: error.message }, { status: 404 });
        }
      }
      logger.logErrorWithObject(error, 'Error deleting page content');
      return NextResponse.json(
        { error: 'Failed to delete page content' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);
