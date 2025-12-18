import { injectable, inject } from 'tsyringe';
import { Category } from '@/domain/product/entities/Category';
import type { ICategoryRepository } from '@/domain/product/repositories/ICategoryRepository';
import type { IGetCategories } from './IGetCategories';

@injectable()
export class GetCategories implements IGetCategories {
  constructor(
    @inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(options?: { search?: string }): Promise<Category[]> {
    const categories = await this.categoryRepository.getAll();

    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      return categories.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower)
      );
    }

    return categories;
  }
}
