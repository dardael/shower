import { injectable, inject } from 'tsyringe';
import type { IProductRepository } from '@/domain/product/repositories/IProductRepository';
import type {
  PublicProductDTO,
  ProductListSortBy,
} from '@/domain/product/types/ProductListConfig';
import type { IGetPublicProducts } from './IGetPublicProducts';

@injectable()
export class GetPublicProducts implements IGetPublicProducts {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository
  ) {}

  async execute(
    categoryIds?: string[] | null,
    sortBy: ProductListSortBy = 'displayOrder'
  ): Promise<PublicProductDTO[]> {
    let products = await this.productRepository.getAll();

    if (categoryIds && categoryIds.length > 0) {
      products = products.filter((product) =>
        product.categoryIds.some((catId) => categoryIds.includes(catId))
      );
    }

    // Sort products based on sortBy parameter
    products = [...products].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'createdAt':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'displayOrder':
        default:
          return a.displayOrder - b.displayOrder;
      }
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
    }));
  }
}
