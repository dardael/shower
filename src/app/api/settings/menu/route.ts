import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { container } from '@/infrastructure/container';
import type { GetMenuItems } from '@/application/menu/GetMenuItems';
import type { AddMenuItem } from '@/application/menu/AddMenuItem';
import type { ReorderMenuItems } from '@/application/menu/ReorderMenuItems';
import { Logger } from '@/application/shared/Logger';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import type {
  GetMenuItemsResponse,
  AddMenuItemResponse,
  ReorderMenuItemsResponse,
  AddMenuItemRequest,
  ReorderMenuItemsRequest,
} from '@/app/api/settings/menu/types';

export const GET = withApi(
  async () => {
    const logger = container.resolve<Logger>('Logger');

    try {
      const getMenuItems = container.resolve<GetMenuItems>('IGetMenuItems');
      const menuItems = await getMenuItems.execute();

      const response: GetMenuItemsResponse = {
        items: menuItems.map((item) => ({
          id: item.id,
          text: item.text.value,
          url: item.url.value,
          position: item.position,
        })),
      };

      return NextResponse.json(response);
    } catch (error) {
      logger.logErrorWithObject(error, 'Error fetching menu items');
      return NextResponse.json(
        { error: 'Failed to fetch menu items' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);

export const POST = withApi(
  async (request: NextRequest) => {
    const logger = container.resolve<Logger>('Logger');

    try {
      const body = (await request.json()) as AddMenuItemRequest;

      if (
        !body.text ||
        typeof body.text !== 'string' ||
        !body.url ||
        typeof body.url !== 'string'
      ) {
        return NextResponse.json(
          { error: 'Text and URL are required' },
          { status: 400 }
        );
      }

      const addMenuItem = container.resolve<AddMenuItem>('IAddMenuItem');
      const menuItem = await addMenuItem.execute(body.text, body.url);

      const response: AddMenuItemResponse = {
        message: 'Menu item added successfully',
        item: {
          id: menuItem.id,
          text: menuItem.text.value,
          url: menuItem.url.value,
          position: menuItem.position,
        },
      };

      logger.info('Menu item added successfully', { id: menuItem.id });

      // Invalidate cache for menu items to ensure immediate visibility on public side
      revalidateTag('menu-items');
      logger.info('Cache invalidated for menu-items tag');

      return NextResponse.json(response, { status: 201 });
    } catch (error) {
      logger.logErrorWithObject(error, 'Error adding menu item');

      if (error instanceof Error) {
        if (
          error.message.includes('cannot be empty') ||
          error.message.includes('cannot exceed') ||
          error.message.includes('must be a relative path')
        ) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      }

      return NextResponse.json(
        { error: 'Failed to add menu item' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);

export const PUT = withApi(
  async (request: NextRequest) => {
    const logger = container.resolve<Logger>('Logger');

    try {
      const body = (await request.json()) as ReorderMenuItemsRequest;

      if (!Array.isArray(body.orderedIds)) {
        return NextResponse.json(
          { error: 'Invalid request: orderedIds must be an array' },
          { status: 400 }
        );
      }

      const reorderMenuItems =
        container.resolve<ReorderMenuItems>('IReorderMenuItems');
      await reorderMenuItems.execute(body.orderedIds);

      const response: ReorderMenuItemsResponse = {
        message: 'Menu items reordered successfully',
      };

      logger.info('Menu items reordered successfully', {
        count: body.orderedIds.length,
      });

      // Invalidate cache for menu items to ensure immediate visibility on public side
      revalidateTag('menu-items');
      logger.info('Cache invalidated for menu-items tag');

      return NextResponse.json(response);
    } catch (error) {
      logger.logErrorWithObject(error, 'Error reordering menu items');

      if (error instanceof Error) {
        if (error.message.includes('Invalid item IDs')) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      }

      return NextResponse.json(
        { error: 'Failed to reorder menu items' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);
