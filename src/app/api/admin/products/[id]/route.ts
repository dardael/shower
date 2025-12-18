import { NextResponse } from 'next/server';
import '@/infrastructure/container';
import { ProductServiceLocator } from '@/infrastructure/container';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import {
  mapProductToResponse,
  type UpdateProductRequest,
  type UpdateProductResponse,
  type DeleteProductResponse,
} from '../types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  { params }: RouteParams
): Promise<
  NextResponse<
    { product: ReturnType<typeof mapProductToResponse> } | { error: string }
  >
> {
  try {
    await DatabaseConnection.getInstance().connect();
    const { id } = await params;
    const productRepository = ProductServiceLocator.getProductRepository();
    const product = await productRepository.getById(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: mapProductToResponse(product) });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<UpdateProductResponse | { error: string }>> {
  try {
    await DatabaseConnection.getInstance().connect();
    const { id } = await params;
    const body = (await request.json()) as UpdateProductRequest;

    const updateProduct = ProductServiceLocator.getUpdateProduct();
    const product = await updateProduct.execute(id, {
      name: body.name?.trim(),
      description: body.description?.trim(),
      price: body.price,
      imageUrl: body.imageUrl,
      categoryIds: body.categoryIds,
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Product updated successfully',
      product: mapProductToResponse(product),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteParams
): Promise<NextResponse<DeleteProductResponse | { error: string }>> {
  try {
    await DatabaseConnection.getInstance().connect();
    const { id } = await params;

    const deleteProduct = ProductServiceLocator.getDeleteProduct();
    const deleted = await deleteProduct.execute(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
