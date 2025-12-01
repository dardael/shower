import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import type { GetPageContent } from '@/application/pages/use-cases/GetPageContent';
import { Logger } from '@/application/shared/Logger';
import { withApiParams } from '@/infrastructure/shared/apiWrapper';
import type { PublicPageContentResponse } from '@/app/api/pages/types';

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
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }

      const response: PublicPageContentResponse = {
        id: pageContent.id,
        menuItemId: pageContent.menuItemId,
        content: pageContent.content.value,
      };

      return NextResponse.json(response);
    } catch (error) {
      logger.logErrorWithObject(error, 'Error fetching public page content');
      return NextResponse.json(
        { error: 'Failed to fetch page content' },
        { status: 500 }
      );
    }
  },
  { requireAuth: false }
);
