import 'reflect-metadata';
import { ReorderCategories } from '@/application/product/ReorderCategories';
import { Category } from '@/domain/product/entities/Category';
import type { ICategoryRepository } from '@/domain/product/repositories/ICategoryRepository';

const mockCategoryRepository: jest.Mocked<ICategoryRepository> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getProductCount: jest.fn(),
  reorder: jest.fn(),
};

describe('ReorderCategories', () => {
  let useCase: ReorderCategories;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ReorderCategories(mockCategoryRepository);
  });

  it('should reorder categories with valid IDs', async () => {
    const categories = [
      Category.create({ name: 'Electronics', description: '' }),
      Category.create({ name: 'Clothing', description: '' }),
      Category.create({ name: 'Books', description: '' }),
    ];

    mockCategoryRepository.reorder.mockResolvedValue();
    mockCategoryRepository.getAll.mockResolvedValue(categories);

    const orderedIds = [categories[2].id, categories[0].id, categories[1].id];

    const result = await useCase.execute(orderedIds);

    expect(mockCategoryRepository.reorder).toHaveBeenCalledWith(orderedIds);
    expect(mockCategoryRepository.getAll).toHaveBeenCalled();
    expect(result).toHaveLength(3);
  });

  it('should handle empty ordered IDs array', async () => {
    mockCategoryRepository.reorder.mockResolvedValue();
    mockCategoryRepository.getAll.mockResolvedValue([]);

    const result = await useCase.execute([]);

    expect(mockCategoryRepository.reorder).toHaveBeenCalledWith([]);
    expect(mockCategoryRepository.getAll).toHaveBeenCalled();
    expect(result).toHaveLength(0);
  });

  it('should call reorder before getAll', async () => {
    mockCategoryRepository.reorder.mockResolvedValue();
    mockCategoryRepository.getAll.mockResolvedValue([]);

    await useCase.execute(['id-1', 'id-2']);

    const reorderOrder =
      mockCategoryRepository.reorder.mock.invocationCallOrder[0];
    const getAllOrder =
      mockCategoryRepository.getAll.mock.invocationCallOrder[0];

    expect(reorderOrder).toBeLessThan(getAllOrder);
  });

  it('should return all categories after reordering', async () => {
    const categories = [
      Category.create({ name: 'First', description: 'First category' }),
      Category.create({ name: 'Second', description: 'Second category' }),
    ];

    mockCategoryRepository.reorder.mockResolvedValue();
    mockCategoryRepository.getAll.mockResolvedValue(categories);

    const result = await useCase.execute([categories[1].id, categories[0].id]);

    expect(result).toEqual(categories);
  });

  it('should handle single category reorder', async () => {
    const category = Category.create({
      name: 'Single',
      description: 'Only category',
    });

    mockCategoryRepository.reorder.mockResolvedValue();
    mockCategoryRepository.getAll.mockResolvedValue([category]);

    const result = await useCase.execute([category.id]);

    expect(mockCategoryRepository.reorder).toHaveBeenCalledWith([category.id]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Single');
  });
});
