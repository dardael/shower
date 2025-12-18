import { injectable, inject } from 'tsyringe';
import type { IProductRepository } from '@/domain/product/repositories/IProductRepository';
import type { IReorderProducts } from './IReorderProducts';

@injectable()
export class ReorderProducts implements IReorderProducts {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository
  ) {}

  async execute(productIds: string[]): Promise<void> {
    return this.productRepository.reorder(productIds);
  }
}
