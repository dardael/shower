import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import type { RemoveMenuItem } from '@/application/menu/RemoveMenuItem';
import { Logger } from '@/application/shared/Logger';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import { authenticateRequest } from '@/infrastructure/auth/ApiAuthentication';
import type { DeleteMenuItemResponse } from '@/app/api/settings/menu/types';

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const logger = container.resolve<Logger>('Logger');

  try {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();

    const authResult = await authenticateRequest(request);
    if (authResult) {
      return authResult;
    }

    const { id } = await props.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Menu item ID is required' },
        { status: 400 }
      );
    }

    const removeMenuItem = container.resolve<RemoveMenuItem>('IRemoveMenuItem');
    await removeMenuItem.execute(id);

    const response: DeleteMenuItemResponse = {
      message: 'Menu item removed successfully',
    };

    logger.info('Menu item removed successfully', { id });

    return NextResponse.json(response);
  } catch (error) {
    logger.logErrorWithObject(error, 'Error removing menu item');

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: 'Failed to remove menu item' },
      { status: 500 }
    );
  }
}
