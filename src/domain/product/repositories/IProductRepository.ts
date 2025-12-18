import { Product } from '@/domain/product/entities/Product';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getByCategory(categoryId: string): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  reorder(orderedIds: string[]): Promise<void>;
  getMaxDisplayOrder(): Promise<number>;
  removeCategoryFromAll(categoryId: string): Promise<void>;
}
