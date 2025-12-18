import { NextResponse } from 'next/server';
import '@/infrastructure/container';
import { ProductServiceLocator } from '@/infrastructure/container';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import {
  mapProductToResponse,
  type GetProductsResponse,
  type CreateProductRequest,
  type CreateProductResponse,
  type ReorderProductsRequest,
  type ReorderProductsResponse,
} from './types';

export async function GET(
  request: Request
): Promise<NextResponse<GetProductsResponse | { error: string }>> {
  try {
    await DatabaseConnection.getInstance().connect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;

    const getProducts = ProductServiceLocator.getGetProducts();
    const products = await getProducts.execute({ search, categoryId });

    return NextResponse.json({
      products: products.map(mapProductToResponse),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<CreateProductResponse | { error: string }>> {
  try {
    await DatabaseConnection.getInstance().connect();
    const body = (await request.json()) as CreateProductRequest;

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    if (body.price === undefined || body.price < 0) {
      return NextResponse.json(
        { error: 'Valid price is required' },
        { status: 400 }
      );
    }

    const createProduct = ProductServiceLocator.getCreateProduct();
    const product = await createProduct.execute({
      name: body.name.trim(),
      description: body.description?.trim() || '',
      price: body.price,
      imageUrl: body.imageUrl || '',
      categoryIds: body.categoryIds || [],
    });

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product: mapProductToResponse(product),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request
): Promise<NextResponse<ReorderProductsResponse | { error: string }>> {
  try {
    await DatabaseConnection.getInstance().connect();
    const body = (await request.json()) as ReorderProductsRequest;

    if (!body.orderedIds || !Array.isArray(body.orderedIds)) {
      return NextResponse.json(
        { error: 'orderedIds array is required' },
        { status: 400 }
      );
    }

    const reorderProducts = ProductServiceLocator.getReorderProducts();
    await reorderProducts.execute(body.orderedIds);

    return NextResponse.json({
      message: 'Products reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering products:', error);
    return NextResponse.json(
      { error: 'Failed to reorder products' },
      { status: 500 }
    );
  }
}
