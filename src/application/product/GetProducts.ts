import { injectable, inject } from 'tsyringe';
import { Product } from '@/domain/product/entities/Product';
import type { IProductRepository } from '@/domain/product/repositories/IProductRepository';
import type { IGetProducts } from './IGetProducts';

@injectable()
export class GetProducts implements IGetProducts {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository
  ) {}

  async execute(options?: {
    search?: string;
    categoryId?: string;
  }): Promise<Product[]> {
    let products = await this.productRepository.getAll();

    if (options?.categoryId) {
      products = await this.productRepository.getByCategory(options.categoryId);
    }

    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    return products;
  }
}
