import { injectable, inject } from 'tsyringe';
import type { ICategoryRepository } from '@/domain/product/repositories/ICategoryRepository';
import type { IProductRepository } from '@/domain/product/repositories/IProductRepository';
import type { IDeleteCategory } from './IDeleteCategory';

@injectable()
export class DeleteCategory implements IDeleteCategory {
  constructor(
    @inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository
  ) {}

  async execute(id: string): Promise<boolean> {
    const existing = await this.categoryRepository.getById(id);
    if (!existing) {
      return false;
    }

    // Unassign products from this category before deleting
    await this.productRepository.removeCategoryFromAll(id);
    await this.categoryRepository.delete(id);
    return true;
  }
}
