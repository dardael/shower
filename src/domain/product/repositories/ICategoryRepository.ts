import { Category } from '@/domain/product/entities/Category';

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  create(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
  getProductCount(categoryId: string): Promise<number>;
  reorder(orderedIds: string[]): Promise<void>;
}
