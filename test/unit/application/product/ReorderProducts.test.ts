import 'reflect-metadata';
import { ReorderProducts } from '@/application/product/ReorderProducts';
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

describe('ReorderProducts', () => {
  let useCase: ReorderProducts;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ReorderProducts(mockProductRepository);
  });

  it('should reorder products with valid IDs', async () => {
    mockProductRepository.reorder.mockResolvedValue();

    const orderedIds = ['product-3', 'product-1', 'product-2'];

    await useCase.execute(orderedIds);

    expect(mockProductRepository.reorder).toHaveBeenCalledWith(orderedIds);
  });

  it('should handle empty ordered IDs array', async () => {
    mockProductRepository.reorder.mockResolvedValue();

    await useCase.execute([]);

    expect(mockProductRepository.reorder).toHaveBeenCalledWith([]);
  });

  it('should handle single product reorder', async () => {
    mockProductRepository.reorder.mockResolvedValue();

    await useCase.execute(['single-product-id']);

    expect(mockProductRepository.reorder).toHaveBeenCalledWith([
      'single-product-id',
    ]);
  });

  it('should pass product IDs to repository in exact order', async () => {
    mockProductRepository.reorder.mockResolvedValue();

    const orderedIds = ['id-5', 'id-3', 'id-8', 'id-1', 'id-2'];

    await useCase.execute(orderedIds);

    const calledIds = mockProductRepository.reorder.mock.calls[0][0];
    expect(calledIds).toEqual(['id-5', 'id-3', 'id-8', 'id-1', 'id-2']);
  });

  it('should call repository reorder exactly once', async () => {
    mockProductRepository.reorder.mockResolvedValue();

    await useCase.execute(['id-1', 'id-2', 'id-3']);

    expect(mockProductRepository.reorder).toHaveBeenCalledTimes(1);
  });

  it('should handle large number of products', async () => {
    mockProductRepository.reorder.mockResolvedValue();

    const manyIds = Array.from({ length: 100 }, (_, i) => `product-${i}`);

    await useCase.execute(manyIds);

    expect(mockProductRepository.reorder).toHaveBeenCalledWith(manyIds);
    expect(mockProductRepository.reorder.mock.calls[0][0]).toHaveLength(100);
  });

  it('should return void on successful reorder', async () => {
    mockProductRepository.reorder.mockResolvedValue();

    const result = await useCase.execute(['id-1', 'id-2']);

    expect(result).toBeUndefined();
  });
});
