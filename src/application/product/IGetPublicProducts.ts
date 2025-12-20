import type { PublicProductDTO } from '@/domain/product/types/ProductListConfig';
import type { ProductListSortBy } from '@/domain/product/types/ProductListConfig';

export interface IGetPublicProducts {
  execute(
    categoryIds?: string[] | null,
    sortBy?: ProductListSortBy
  ): Promise<PublicProductDTO[]>;
}
