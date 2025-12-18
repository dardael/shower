import { NextResponse } from 'next/server';
import '@/infrastructure/container';
import { ProductServiceLocator } from '@/infrastructure/container';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';

interface ReorderRequest {
  productIds: string[];
}

interface ReorderResponse {
  success: boolean;
}

export async function PUT(
  request: Request
): Promise<NextResponse<ReorderResponse | { error: string }>> {
  try {
    await DatabaseConnection.getInstance().connect();
    const body = (await request.json()) as ReorderRequest;

    if (!body.productIds || !Array.isArray(body.productIds)) {
      return NextResponse.json(
        { error: 'productIds array is required' },
        { status: 400 }
      );
    }

    const reorderProducts = ProductServiceLocator.getReorderProducts();
    await reorderProducts.execute(body.productIds);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering products:', error);
    return NextResponse.json(
      { error: 'Failed to reorder products' },
      { status: 500 }
    );
  }
}
