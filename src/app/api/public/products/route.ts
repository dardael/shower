import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { getClientIP } from '@/infrastructure/shared/utils/clientIP';
import type { IGetPublicProducts } from '@/application/product/IGetPublicProducts';
import type { ProductListSortBy } from '@/domain/product/types/ProductListConfig';

const VALID_SORT_BY: ProductListSortBy[] = [
  'displayOrder',
  'name',
  'price',
  'createdAt',
];

/**
 * Public API endpoint for products
 * Returns products for public display, optionally filtered by category
 * No authentication required - public endpoint
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const logger = container.resolve<Logger>('Logger');

  const clientIP = getClientIP(request);

  logger.logApiRequest('GET', '/api/public/products', undefined, {
    userAgent: request.headers.get('user-agent'),
    ip: clientIP,
  });

  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryIdsParam = searchParams.get('categoryIds');
    const sortByParam = searchParams.get('sortBy');

    const categoryIds = categoryIdsParam
      ? categoryIdsParam.split(',').filter((id) => id.trim().length > 0)
      : null;

    const sortBy: ProductListSortBy = VALID_SORT_BY.includes(
      sortByParam as ProductListSortBy
    )
      ? (sortByParam as ProductListSortBy)
      : 'displayOrder';

    const getPublicProducts =
      container.resolve<IGetPublicProducts>('IGetPublicProducts');
    const products = await getPublicProducts.execute(categoryIds, sortBy);

    const duration = Date.now() - startTime;

    logger.logApiResponse('GET', '/api/public/products', 200, duration, {
      count: products.length,
      categoryFilter: categoryIds?.length ?? 'none',
      sortBy,
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    logger.logErrorWithObject(error, 'Failed to fetch products', {
      endpoint: '/api/public/products',
      duration,
    });

    logger.logApiResponse('GET', '/api/public/products', 500, duration);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}
