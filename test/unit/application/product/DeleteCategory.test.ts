import 'reflect-metadata';
import { DeleteCategory } from '@/application/product/DeleteCategory';
import { Category } from '@/domain/product/entities/Category';
import type { ICategoryRepository } from '@/domain/product/repositories/ICategoryRepository';
import type { IProductRepository } from '@/domain/product/repositories/IProductRepository';

const mockCategoryRepository: jest.Mocked<ICategoryRepository> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getProductCount: jest.fn(),
  reorder: jest.fn(),
};

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

describe('DeleteCategory', () => {
  let useCase: DeleteCategory;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteCategory(mockCategoryRepository, mockProductRepository);
  });

  it('should delete an existing category', async () => {
    const existingCategory = Category.create({
      name: 'Electronics',
      description: 'Electronic devices',
    });

    mockCategoryRepository.getById.mockResolvedValue(existingCategory);
    mockProductRepository.removeCategoryFromAll.mockResolvedValue();
    mockCategoryRepository.delete.mockResolvedValue();

    const result = await useCase.execute('category-id');

    expect(mockCategoryRepository.getById).toHaveBeenCalledWith('category-id');
    expect(mockProductRepository.removeCategoryFromAll).toHaveBeenCalledWith(
      'category-id'
    );
    expect(mockCategoryRepository.delete).toHaveBeenCalledWith('category-id');
    expect(result).toBe(true);
  });

  it('should return false when category does not exist', async () => {
    mockCategoryRepository.getById.mockResolvedValue(null);

    const result = await useCase.execute('non-existent-id');

    expect(mockCategoryRepository.getById).toHaveBeenCalledWith(
      'non-existent-id'
    );
    expect(mockProductRepository.removeCategoryFromAll).not.toHaveBeenCalled();
    expect(mockCategoryRepository.delete).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should remove category from all products before deleting', async () => {
    const existingCategory = Category.create({
      name: 'Clothing',
      description: 'Apparel items',
    });

    mockCategoryRepository.getById.mockResolvedValue(existingCategory);
    mockProductRepository.removeCategoryFromAll.mockResolvedValue();
    mockCategoryRepository.delete.mockResolvedValue();

    await useCase.execute('category-id');

    const removeCategoryOrder =
      mockProductRepository.removeCategoryFromAll.mock.invocationCallOrder[0];
    const deleteOrder =
      mockCategoryRepository.delete.mock.invocationCallOrder[0];

    expect(removeCategoryOrder).toBeLessThan(deleteOrder);
  });

  it('should call getById before removeCategoryFromAll', async () => {
    const existingCategory = Category.create({
      name: 'Books',
      description: 'Reading materials',
    });

    mockCategoryRepository.getById.mockResolvedValue(existingCategory);
    mockProductRepository.removeCategoryFromAll.mockResolvedValue();
    mockCategoryRepository.delete.mockResolvedValue();

    await useCase.execute('category-id');

    const getByIdOrder =
      mockCategoryRepository.getById.mock.invocationCallOrder[0];
    const removeCategoryOrder =
      mockProductRepository.removeCategoryFromAll.mock.invocationCallOrder[0];

    expect(getByIdOrder).toBeLessThan(removeCategoryOrder);
  });
});
