import { Category } from '@/domain/product/entities/Category';

export interface IGetCategories {
  execute(options?: { search?: string }): Promise<Category[]>;
}
