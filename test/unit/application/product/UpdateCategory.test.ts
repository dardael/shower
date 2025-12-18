import 'reflect-metadata';
import { UpdateCategory } from '@/application/product/UpdateCategory';
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

describe('UpdateCategory', () => {
  let useCase: UpdateCategory;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateCategory(mockCategoryRepository);
  });

  it('should update category name', async () => {
    const existingCategory = Category.create({
      name: 'Old Name',
      description: 'Description',
    });
    const updatedCategory = existingCategory.withName('New Name');

    mockCategoryRepository.getById.mockResolvedValue(existingCategory);
    mockCategoryRepository.update.mockResolvedValue(updatedCategory);

    const result = await useCase.execute('category-id', { name: 'New Name' });

    expect(mockCategoryRepository.getById).toHaveBeenCalledWith('category-id');
    expect(mockCategoryRepository.update).toHaveBeenCalled();
    expect(result?.name).toBe('New Name');
  });

  it('should update category description', async () => {
    const existingCategory = Category.create({
      name: 'Category',
      description: 'Old Description',
    });
    const updatedCategory = existingCategory.withDescription('New Description');

    mockCategoryRepository.getById.mockResolvedValue(existingCategory);
    mockCategoryRepository.update.mockResolvedValue(updatedCategory);

    const result = await useCase.execute('category-id', {
      description: 'New Description',
    });

    expect(mockCategoryRepository.update).toHaveBeenCalled();
    expect(result?.description).toBe('New Description');
  });

  it('should update both name and description', async () => {
    const existingCategory = Category.create({
      name: 'Old Name',
      description: 'Old Description',
    });
    const updatedCategory = existingCategory
      .withName('New Name')
      .withDescription('New Description');

    mockCategoryRepository.getById.mockResolvedValue(existingCategory);
    mockCategoryRepository.update.mockResolvedValue(updatedCategory);

    const result = await useCase.execute('category-id', {
      name: 'New Name',
      description: 'New Description',
    });

    expect(result?.name).toBe('New Name');
    expect(result?.description).toBe('New Description');
  });

  it('should return null when category does not exist', async () => {
    mockCategoryRepository.getById.mockResolvedValue(null);

    const result = await useCase.execute('non-existent-id', {
      name: 'New Name',
    });

    expect(mockCategoryRepository.getById).toHaveBeenCalledWith(
      'non-existent-id'
    );
    expect(mockCategoryRepository.update).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should throw error when updating to empty name', async () => {
    const existingCategory = Category.create({
      name: 'Valid Name',
      description: 'Description',
    });

    mockCategoryRepository.getById.mockResolvedValue(existingCategory);

    await expect(useCase.execute('category-id', { name: '' })).rejects.toThrow(
      'Category name is required'
    );

    expect(mockCategoryRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when updating to name exceeding 100 characters', async () => {
    const existingCategory = Category.create({
      name: 'Valid Name',
      description: 'Description',
    });
    const longName = 'a'.repeat(101);

    mockCategoryRepository.getById.mockResolvedValue(existingCategory);

    await expect(
      useCase.execute('category-id', { name: longName })
    ).rejects.toThrow('Category name must be 100 characters or less');

    expect(mockCategoryRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when updating to description exceeding 2000 characters', async () => {
    const existingCategory = Category.create({
      name: 'Category',
      description: 'Valid description',
    });
    const longDescription = 'a'.repeat(2001);

    mockCategoryRepository.getById.mockResolvedValue(existingCategory);

    await expect(
      useCase.execute('category-id', { description: longDescription })
    ).rejects.toThrow('Category description must be 2000 characters or less');

    expect(mockCategoryRepository.update).not.toHaveBeenCalled();
  });

  it('should call getById before update', async () => {
    const existingCategory = Category.create({
      name: 'Category',
      description: 'Description',
    });

    mockCategoryRepository.getById.mockResolvedValue(existingCategory);
    mockCategoryRepository.update.mockResolvedValue(existingCategory);

    await useCase.execute('category-id', { name: 'Updated' });

    const getByIdOrder =
      mockCategoryRepository.getById.mock.invocationCallOrder[0];
    const updateOrder =
      mockCategoryRepository.update.mock.invocationCallOrder[0];

    expect(getByIdOrder).toBeLessThan(updateOrder);
  });
});
