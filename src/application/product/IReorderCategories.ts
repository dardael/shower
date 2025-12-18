import { Category } from '@/domain/product/entities/Category';

export interface IReorderCategories {
  execute(orderedIds: string[]): Promise<Category[]>;
}
