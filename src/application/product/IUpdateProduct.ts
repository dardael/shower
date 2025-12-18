import { Product } from '@/domain/product/entities/Product';

export interface IUpdateProduct {
  execute(
    id: string,
    input: {
      name?: string;
      description?: string;
      price?: number;
      imageUrl?: string;
      categoryIds?: string[];
    }
  ): Promise<Product | null>;
}
