import { injectable, inject } from 'tsyringe';
import { Product } from '@/domain/product/entities/Product';
import type { IProductRepository } from '@/domain/product/repositories/IProductRepository';
import type { ICreateProduct } from './ICreateProduct';

@injectable()
export class CreateProduct implements ICreateProduct {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository
  ) {}

  async execute(input: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryIds: string[];
  }): Promise<Product> {
    const maxDisplayOrder = await this.productRepository.getMaxDisplayOrder();

    const product = Product.create({
      name: input.name,
      description: input.description,
      price: input.price,
      imageUrl: input.imageUrl,
      categoryIds: input.categoryIds,
      displayOrder: maxDisplayOrder + 1,
    });

    return this.productRepository.create(product);
  }
}
