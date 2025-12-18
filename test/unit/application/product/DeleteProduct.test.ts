import 'reflect-metadata';
import { DeleteProduct } from '@/application/product/DeleteProduct';
import { Product } from '@/domain/product/entities/Product';
import type { IProductRepository } from '@/domain/product/repositories/IProductRepository';

const mockProductRepository: jest.Mocked<IProductRepository> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  getByCategory: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  reorder: jest.fn(),
  getMaxDisplayOrder: jest.fn(),
  removeCategoryFromAll: jest.fn(),
};

describe('DeleteProduct', () => {
  let useCase: DeleteProduct;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteProduct(mockProductRepository);
  });

  it('should delete an existing product', async () => {
    const existingProduct = Product.create({
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 999.99,
      imageUrl: '/images/laptop.jpg',
      categoryIds: ['cat-1'],
    });

    mockProductRepository.getById.mockResolvedValue(existingProduct);
    mockProductRepository.delete.mockResolvedValue();

    const result = await useCase.execute('product-id');

    expect(mockProductRepository.getById).toHaveBeenCalledWith('product-id');
    expect(mockProductRepository.delete).toHaveBeenCalledWith('product-id');
    expect(result).toBe(true);
  });

  it('should return false when product does not exist', async () => {
    mockProductRepository.getById.mockResolvedValue(null);

    const result = await useCase.execute('non-existent-id');

    expect(mockProductRepository.getById).toHaveBeenCalledWith(
      'non-existent-id'
    );
    expect(mockProductRepository.delete).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should call getById before delete', async () => {
    const existingProduct = Product.create({
      name: 'Phone',
      description: 'Smartphone',
      price: 499.99,
      imageUrl: '',
      categoryIds: [],
    });

    mockProductRepository.getById.mockResolvedValue(existingProduct);
    mockProductRepository.delete.mockResolvedValue();

    await useCase.execute('product-id');

    const getByIdOrder =
      mockProductRepository.getById.mock.invocationCallOrder[0];
    const deleteOrder =
      mockProductRepository.delete.mock.invocationCallOrder[0];

    expect(getByIdOrder).toBeLessThan(deleteOrder);
  });

  it('should delete product regardless of category assignments', async () => {
    const productWithCategories = Product.create({
      name: 'Multi-Category Product',
      description: 'Product in multiple categories',
      price: 150,
      imageUrl: '',
      categoryIds: ['cat-1', 'cat-2', 'cat-3'],
    });

    mockProductRepository.getById.mockResolvedValue(productWithCategories);
    mockProductRepository.delete.mockResolvedValue();

    const result = await useCase.execute('product-id');

    expect(mockProductRepository.delete).toHaveBeenCalledWith('product-id');
    expect(result).toBe(true);
  });

  it('should delete product with no categories', async () => {
    const productWithoutCategories = Product.create({
      name: 'Uncategorized Product',
      description: 'No categories',
      price: 50,
      imageUrl: '',
      categoryIds: [],
    });

    mockProductRepository.getById.mockResolvedValue(productWithoutCategories);
    mockProductRepository.delete.mockResolvedValue();

    const result = await useCase.execute('product-id');

    expect(mockProductRepository.delete).toHaveBeenCalledWith('product-id');
    expect(result).toBe(true);
  });
});
