import { injectable, inject } from 'tsyringe';
import type { IProductRepository } from '@/domain/product/repositories/IProductRepository';
import type { IDeleteProduct } from './IDeleteProduct';

@injectable()
export class DeleteProduct implements IDeleteProduct {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository
  ) {}

  async execute(id: string): Promise<boolean> {
    const existing = await this.productRepository.getById(id);
    if (!existing) {
      return false;
    }
    await this.productRepository.delete(id);
    return true;
  }
}
