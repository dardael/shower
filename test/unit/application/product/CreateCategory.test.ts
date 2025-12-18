import 'reflect-metadata';
import { CreateCategory } from '@/application/product/CreateCategory';
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

describe('CreateCategory', () => {
  let useCase: CreateCategory;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateCategory(mockCategoryRepository);
  });

  it('should create and save a category with valid name and description', async () => {
    const savedCategory = Category.create({
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
    });
    mockCategoryRepository.create.mockResolvedValue(savedCategory);

    const result = await useCase.execute({
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
    });

    expect(mockCategoryRepository.create).toHaveBeenCalled();
    expect(result.name).toBe('Electronics');
    expect(result.description).toBe('Electronic devices and gadgets');
  });

  it('should create a category with empty description', async () => {
    const savedCategory = Category.create({
      name: 'Clothing',
      description: '',
    });
    mockCategoryRepository.create.mockResolvedValue(savedCategory);

    const result = await useCase.execute({
      name: 'Clothing',
      description: '',
    });

    expect(mockCategoryRepository.create).toHaveBeenCalled();
    expect(result.name).toBe('Clothing');
    expect(result.description).toBe('');
  });

  it('should throw error for empty category name', async () => {
    await expect(
      useCase.execute({ name: '', description: 'Some description' })
    ).rejects.toThrow('Category name is required');

    expect(mockCategoryRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error for whitespace-only category name', async () => {
    await expect(
      useCase.execute({ name: '   ', description: 'Some description' })
    ).rejects.toThrow('Category name is required');

    expect(mockCategoryRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error for category name exceeding 100 characters', async () => {
    const longName = 'a'.repeat(101);

    await expect(
      useCase.execute({ name: longName, description: 'Description' })
    ).rejects.toThrow('Category name must be 100 characters or less');

    expect(mockCategoryRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error for description exceeding 2000 characters', async () => {
    const longDescription = 'a'.repeat(2001);

    await expect(
      useCase.execute({ name: 'Valid Name', description: longDescription })
    ).rejects.toThrow('Category description must be 2000 characters or less');

    expect(mockCategoryRepository.create).not.toHaveBeenCalled();
  });

  it('should accept category name at maximum length of 100 characters', async () => {
    const maxLengthName = 'a'.repeat(100);
    const savedCategory = Category.create({
      name: maxLengthName,
      description: 'Description',
    });
    mockCategoryRepository.create.mockResolvedValue(savedCategory);

    const result = await useCase.execute({
      name: maxLengthName,
      description: 'Description',
    });

    expect(mockCategoryRepository.create).toHaveBeenCalled();
    expect(result.name).toBe(maxLengthName);
  });

  it('should accept description at maximum length of 2000 characters', async () => {
    const maxLengthDescription = 'a'.repeat(2000);
    const savedCategory = Category.create({
      name: 'Category',
      description: maxLengthDescription,
    });
    mockCategoryRepository.create.mockResolvedValue(savedCategory);

    const result = await useCase.execute({
      name: 'Category',
      description: maxLengthDescription,
    });

    expect(mockCategoryRepository.create).toHaveBeenCalled();
    expect(result.description).toBe(maxLengthDescription);
  });
});
