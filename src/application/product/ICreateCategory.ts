import { Category } from '@/domain/product/entities/Category';

export interface ICreateCategory {
  execute(input: { name: string; description: string }): Promise<Category>;
}
