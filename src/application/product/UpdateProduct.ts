import { injectable, inject } from 'tsyringe';
import { Product } from '@/domain/product/entities/Product';
import type { IProductRepository } from '@/domain/product/repositories/IProductRepository';
import type { IUpdateProduct } from './IUpdateProduct';

@injectable()
export class UpdateProduct implements IUpdateProduct {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository
  ) {}

  async execute(
    id: string,
    input: {
      name?: string;
      description?: string;
      price?: number;
      imageUrl?: string;
      categoryIds?: string[];
    }
  ): Promise<Product | null> {
    const existing = await this.productRepository.getById(id);
    if (!existing) {
      return null;
    }

    let updated = existing;
    if (input.name !== undefined) {
      updated = updated.withName(input.name);
    }
    if (input.description !== undefined) {
      updated = updated.withDescription(input.description);
    }
    if (input.price !== undefined) {
      updated = updated.withPrice(input.price);
    }
    if (input.imageUrl !== undefined) {
      updated = updated.withImageUrl(input.imageUrl);
    }
    if (input.categoryIds !== undefined) {
      updated = updated.withCategoryIds(input.categoryIds);
    }

    return this.productRepository.update(updated);
  }
}
