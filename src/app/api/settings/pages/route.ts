import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import type { CreatePageContent } from '@/application/pages/use-cases/CreatePageContent';
import { Logger } from '@/application/shared/Logger';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import type {
  CreatePageContentRequest,
  PageContentResponse,
} from '@/app/api/settings/pages/types';

export const POST = withApi(
  async (request: NextRequest) => {
    const logger = container.resolve<Logger>('Logger');

    try {
      const body = (await request.json()) as CreatePageContentRequest;

      if (!body.menuItemId || typeof body.menuItemId !== 'string') {
        return NextResponse.json(
          { error: 'menuItemId is required' },
          { status: 400 }
        );
      }

      if (!body.content || typeof body.content !== 'string') {
        return NextResponse.json(
          { error: 'Content is required' },
          { status: 400 }
        );
      }

      const createPageContent =
        container.resolve<CreatePageContent>('ICreatePageContent');
      const pageContent = await createPageContent.execute(
        body.menuItemId,
        body.content
      );

      const response: PageContentResponse = {
        id: pageContent.id,
        menuItemId: pageContent.menuItemId,
        content: pageContent.content.value,
        createdAt: pageContent.createdAt.toISOString(),
        updatedAt: pageContent.updatedAt.toISOString(),
      };

      logger.info('Page content created successfully', { id: pageContent.id });

      return NextResponse.json(response, { status: 201 });
    } catch (error) {
      logger.logErrorWithObject(error, 'Error creating page content');

      if (error instanceof Error) {
        if (error.message === 'Menu item not found') {
          return NextResponse.json({ error: error.message }, { status: 404 });
        }
        if (
          error.message === 'Page content already exists for this menu item'
        ) {
          return NextResponse.json({ error: error.message }, { status: 409 });
        }
        if (
          error.message.includes('cannot be empty') ||
          error.message.includes('cannot exceed')
        ) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      }

      return NextResponse.json(
        { error: 'Failed to create page content' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);
