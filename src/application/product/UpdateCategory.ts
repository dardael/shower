import { injectable, inject } from 'tsyringe';
import { Category } from '@/domain/product/entities/Category';
import type { ICategoryRepository } from '@/domain/product/repositories/ICategoryRepository';
import type { IUpdateCategory } from './IUpdateCategory';

@injectable()
export class UpdateCategory implements IUpdateCategory {
  constructor(
    @inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(
    id: string,
    input: { name?: string; description?: string }
  ): Promise<Category | null> {
    const existing = await this.categoryRepository.getById(id);
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

    return this.categoryRepository.update(updated);
  }
}
