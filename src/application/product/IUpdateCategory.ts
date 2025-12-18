import { Category } from '@/domain/product/entities/Category';

export interface IUpdateCategory {
  execute(
    id: string,
    input: { name?: string; description?: string }
  ): Promise<Category | null>;
}
