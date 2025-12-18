import { Product } from '@/domain/product/entities/Product';

export interface IGetProducts {
  execute(options?: {
    search?: string;
    categoryId?: string;
  }): Promise<Product[]>;
}
