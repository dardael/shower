import { NextResponse } from 'next/server';
import '@/infrastructure/container';
import { ProductServiceLocator } from '@/infrastructure/container';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import {
  mapCategoryToResponse,
  type UpdateCategoryRequest,
  type UpdateCategoryResponse,
  type DeleteCategoryResponse,
} from '../types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  { params }: RouteParams
): Promise<
  | NextResponse<{ category: ReturnType<typeof mapCategoryToResponse> }>
  | NextResponse<{ error: string }>
> {
  try {
    await DatabaseConnection.getInstance().connect();
    const { id } = await params;

    const categoryRepository = ProductServiceLocator.getCategoryRepository();
    const category = await categoryRepository.getById(id);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ category: mapCategoryToResponse(category) });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<UpdateCategoryResponse | { error: string }>> {
  try {
    await DatabaseConnection.getInstance().connect();
    const { id } = await params;
    const body = (await request.json()) as UpdateCategoryRequest;

    const updateCategory = ProductServiceLocator.getUpdateCategory();
    const category = await updateCategory.execute(id, {
      name: body.name?.trim(),
      description: body.description?.trim(),
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ category: mapCategoryToResponse(category) });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteParams
): Promise<NextResponse<DeleteCategoryResponse | { error: string }>> {
  try {
    await DatabaseConnection.getInstance().connect();
    const { id } = await params;

    const deleteCategory = ProductServiceLocator.getDeleteCategory();
    const success = await deleteCategory.execute(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
