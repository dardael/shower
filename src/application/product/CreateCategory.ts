import { injectable, inject } from 'tsyringe';
import { Category } from '@/domain/product/entities/Category';
import type { ICategoryRepository } from '@/domain/product/repositories/ICategoryRepository';
import type { ICreateCategory } from './ICreateCategory';

@injectable()
export class CreateCategory implements ICreateCategory {
  constructor(
    @inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(input: {
    name: string;
    description: string;
  }): Promise<Category> {
    const category = Category.create({
      name: input.name,
      description: input.description,
    });

    return this.categoryRepository.create(category);
  }
}
