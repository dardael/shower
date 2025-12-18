import { NextResponse } from 'next/server';
import '@/infrastructure/container';
import { ProductServiceLocator } from '@/infrastructure/container';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import {
  mapCategoryToResponse,
  type GetCategoriesResponse,
  type CreateCategoryRequest,
  type CreateCategoryResponse,
} from './types';

export async function GET(): Promise<
  NextResponse<GetCategoriesResponse | { error: string }>
> {
  try {
    await DatabaseConnection.getInstance().connect();

    const getCategories = ProductServiceLocator.getGetCategories();
    const categories = await getCategories.execute();

    return NextResponse.json({
      categories: categories.map(mapCategoryToResponse),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<CreateCategoryResponse | { error: string }>> {
  try {
    await DatabaseConnection.getInstance().connect();
    const body = (await request.json()) as CreateCategoryRequest;

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const createCategory = ProductServiceLocator.getCreateCategory();
    const category = await createCategory.execute({
      name: body.name.trim(),
      description: body.description?.trim() || '',
    });

    return NextResponse.json(
      { category: mapCategoryToResponse(category) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
