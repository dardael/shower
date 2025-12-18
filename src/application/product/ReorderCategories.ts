import { injectable, inject } from 'tsyringe';
import { Category } from '@/domain/product/entities/Category';
import type { ICategoryRepository } from '@/domain/product/repositories/ICategoryRepository';
import type { IReorderCategories } from './IReorderCategories';

@injectable()
export class ReorderCategories implements IReorderCategories {
  constructor(
    @inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(orderedIds: string[]): Promise<Category[]> {
    await this.categoryRepository.reorder(orderedIds);
    return this.categoryRepository.getAll();
  }
}
