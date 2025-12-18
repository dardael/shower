import { NextResponse } from 'next/server';
import '@/infrastructure/container';
import { ProductServiceLocator } from '@/infrastructure/container';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import { mapCategoryToResponse } from '../types';

interface ReorderRequest {
  orderedIds: string[];
}

export async function PUT(
  request: Request
): Promise<
  NextResponse<
    | { categories: ReturnType<typeof mapCategoryToResponse>[] }
    | { error: string }
  >
> {
  try {
    await DatabaseConnection.getInstance().connect();
    const body = (await request.json()) as ReorderRequest;

    if (!body.orderedIds || !Array.isArray(body.orderedIds)) {
      return NextResponse.json(
        { error: 'orderedIds array is required' },
        { status: 400 }
      );
    }

    const reorderCategories = ProductServiceLocator.getReorderCategories();
    const categories = await reorderCategories.execute(body.orderedIds);

    return NextResponse.json({
      categories: categories.map(mapCategoryToResponse),
    });
  } catch (error) {
    console.error('Failed to reorder categories:', error);
    return NextResponse.json(
      { error: 'Failed to reorder categories' },
      { status: 500 }
    );
  }
}
