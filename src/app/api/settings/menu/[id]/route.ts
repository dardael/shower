import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import type { RemoveMenuItem } from '@/application/menu/RemoveMenuItem';
import type { UpdateMenuItem } from '@/application/menu/UpdateMenuItem';
import { Logger } from '@/application/shared/Logger';
import { withApiParams } from '@/infrastructure/shared/apiWrapper';
import type {
  DeleteMenuItemResponse,
  UpdateMenuItemRequest,
  UpdateMenuItemResponse,
} from '@/app/api/settings/menu/types';

interface MenuItemParams {
  id: string;
}

export const DELETE = withApiParams<MenuItemParams, NextResponse>(
  async (_request: NextRequest, props) => {
    const logger = container.resolve<Logger>('Logger');

    try {
      const { id } = await props.params;

      if (!id) {
        return NextResponse.json(
          { error: 'Menu item ID is required' },
          { status: 400 }
        );
      }

      const removeMenuItem =
        container.resolve<RemoveMenuItem>('IRemoveMenuItem');
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
  },
  { requireAuth: true }
);

export const PATCH = withApiParams<MenuItemParams, NextResponse>(
  async (request: NextRequest, props) => {
    const logger = container.resolve<Logger>('Logger');

    try {
      const { id } = await props.params;

      if (!id) {
        return NextResponse.json(
          { error: 'Menu item ID is required' },
          { status: 400 }
        );
      }

      const body = (await request.json()) as UpdateMenuItemRequest;

      if (
        !body.text ||
        typeof body.text !== 'string' ||
        !body.url ||
        typeof body.url !== 'string'
      ) {
        return NextResponse.json(
          { error: 'ID, text, and URL are required' },
          { status: 400 }
        );
      }

      const updateMenuItem =
        container.resolve<UpdateMenuItem>('IUpdateMenuItem');
      const menuItem = await updateMenuItem.execute(id, body.text, body.url);

      const response: UpdateMenuItemResponse = {
        message: 'Menu item updated successfully',
        item: {
          id: menuItem.id,
          text: menuItem.text.value,
          url: menuItem.url.value,
          position: menuItem.position,
        },
      };

      logger.info('Menu item updated successfully', { id });

      return NextResponse.json(response);
    } catch (error) {
      logger.logErrorWithObject(error, 'Error updating menu item');

      if (error instanceof Error) {
        if (error.message === 'Menu item not found') {
          return NextResponse.json({ error: error.message }, { status: 404 });
        }
        if (
          error.message.includes('cannot be empty') ||
          error.message.includes('cannot exceed') ||
          error.message.includes('must be a relative path')
        ) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      }

      return NextResponse.json(
        { error: 'Failed to update menu item' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);
