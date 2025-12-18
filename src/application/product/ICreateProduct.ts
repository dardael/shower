import { Product } from '@/domain/product/entities/Product';

export interface ICreateProduct {
  execute(input: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryIds: string[];
  }): Promise<Product>;
}
