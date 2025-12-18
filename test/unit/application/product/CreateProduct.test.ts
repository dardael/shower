import 'reflect-metadata';
import { CreateProduct } from '@/application/product/CreateProduct';
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

describe('CreateProduct', () => {
  let useCase: CreateProduct;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateProduct(mockProductRepository);
  });

  it('should create and save a product with valid data', async () => {
    const savedProduct = Product.create({
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 999.99,
      imageUrl: '/images/laptop.jpg',
      categoryIds: ['cat-1'],
      displayOrder: 1,
    });

    mockProductRepository.getMaxDisplayOrder.mockResolvedValue(0);
    mockProductRepository.create.mockResolvedValue(savedProduct);

    const result = await useCase.execute({
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 999.99,
      imageUrl: '/images/laptop.jpg',
      categoryIds: ['cat-1'],
    });

    expect(mockProductRepository.getMaxDisplayOrder).toHaveBeenCalled();
    expect(mockProductRepository.create).toHaveBeenCalled();
    expect(result.name).toBe('Laptop');
    expect(result.price).toBe(999.99);
  });

  it('should assign displayOrder as maxDisplayOrder + 1', async () => {
    const savedProduct = Product.create({
      name: 'Phone',
      description: 'Smartphone',
      price: 499.99,
      imageUrl: '',
      categoryIds: [],
      displayOrder: 6,
    });

    mockProductRepository.getMaxDisplayOrder.mockResolvedValue(5);
    mockProductRepository.create.mockResolvedValue(savedProduct);

    await useCase.execute({
      name: 'Phone',
      description: 'Smartphone',
      price: 499.99,
      imageUrl: '',
      categoryIds: [],
    });

    const createdProduct = mockProductRepository.create.mock.calls[0][0];
    expect(createdProduct.displayOrder).toBe(6);
  });

  it('should create product with multiple categories', async () => {
    const savedProduct = Product.create({
      name: 'Tablet',
      description: 'Portable tablet',
      price: 599.99,
      imageUrl: '/images/tablet.jpg',
      categoryIds: ['cat-1', 'cat-2', 'cat-3'],
      displayOrder: 1,
    });

    mockProductRepository.getMaxDisplayOrder.mockResolvedValue(0);
    mockProductRepository.create.mockResolvedValue(savedProduct);

    const result = await useCase.execute({
      name: 'Tablet',
      description: 'Portable tablet',
      price: 599.99,
      imageUrl: '/images/tablet.jpg',
      categoryIds: ['cat-1', 'cat-2', 'cat-3'],
    });

    expect(result.categoryIds).toHaveLength(3);
    expect(result.categoryIds).toContain('cat-1');
    expect(result.categoryIds).toContain('cat-2');
    expect(result.categoryIds).toContain('cat-3');
  });

  it('should create product with empty categories', async () => {
    const savedProduct = Product.create({
      name: 'Accessory',
      description: 'Uncategorized accessory',
      price: 19.99,
      imageUrl: '',
      categoryIds: [],
      displayOrder: 1,
    });

    mockProductRepository.getMaxDisplayOrder.mockResolvedValue(0);
    mockProductRepository.create.mockResolvedValue(savedProduct);

    const result = await useCase.execute({
      name: 'Accessory',
      description: 'Uncategorized accessory',
      price: 19.99,
      imageUrl: '',
      categoryIds: [],
    });

    expect(result.categoryIds).toHaveLength(0);
  });

  it('should throw error for empty product name', async () => {
    mockProductRepository.getMaxDisplayOrder.mockResolvedValue(0);

    await expect(
      useCase.execute({
        name: '',
        description: 'Description',
        price: 10,
        imageUrl: '',
        categoryIds: [],
      })
    ).rejects.toThrow('Product name is required');

    expect(mockProductRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error for whitespace-only product name', async () => {
    mockProductRepository.getMaxDisplayOrder.mockResolvedValue(0);

    await expect(
      useCase.execute({
        name: '   ',
        description: 'Description',
        price: 10,
        imageUrl: '',
        categoryIds: [],
      })
    ).rejects.toThrow('Product name is required');

    expect(mockProductRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error for product name exceeding 200 characters', async () => {
    const longName = 'a'.repeat(201);
    mockProductRepository.getMaxDisplayOrder.mockResolvedValue(0);

    await expect(
      useCase.execute({
        name: longName,
        description: 'Description',
        price: 10,
        imageUrl: '',
        categoryIds: [],
      })
    ).rejects.toThrow('Product name must be 200 characters or less');

    expect(mockProductRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error for zero price', async () => {
    mockProductRepository.getMaxDisplayOrder.mockResolvedValue(0);

    await expect(
      useCase.execute({
        name: 'Product',
        description: 'Description',
        price: 0,
        imageUrl: '',
        categoryIds: [],
      })
    ).rejects.toThrow('Product price must be greater than 0');

    expect(mockProductRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error for negative price', async () => {
    mockProductRepository.getMaxDisplayOrder.mockResolvedValue(0);

    await expect(
      useCase.execute({
        name: 'Product',
        description: 'Description',
        price: -10,
        imageUrl: '',
        categoryIds: [],
      })
    ).rejects.toThrow('Product price must be greater than 0');

    expect(mockProductRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error for description exceeding 5000 characters', async () => {
    const longDescription = 'a'.repeat(5001);
    mockProductRepository.getMaxDisplayOrder.mockResolvedValue(0);

    await expect(
      useCase.execute({
        name: 'Product',
        description: longDescription,
        price: 10,
        imageUrl: '',
        categoryIds: [],
      })
    ).rejects.toThrow('Product description must be 5000 characters or less');

    expect(mockProductRepository.create).not.toHaveBeenCalled();
  });

  it('should accept product name at maximum length of 200 characters', async () => {
    const maxLengthName = 'a'.repeat(200);
    const savedProduct = Product.create({
      name: maxLengthName,
      description: 'Description',
      price: 10,
      imageUrl: '',
      categoryIds: [],
      displayOrder: 1,
    });

    mockProductRepository.getMaxDisplayOrder.mockResolvedValue(0);
    mockProductRepository.create.mockResolvedValue(savedProduct);

    const result = await useCase.execute({
      name: maxLengthName,
      description: 'Description',
      price: 10,
      imageUrl: '',
      categoryIds: [],
    });

    expect(mockProductRepository.create).toHaveBeenCalled();
    expect(result.name).toBe(maxLengthName);
  });

  it('should call getMaxDisplayOrder before create', async () => {
    const savedProduct = Product.create({
      name: 'Product',
      description: '',
      price: 10,
      imageUrl: '',
      categoryIds: [],
      displayOrder: 1,
    });

    mockProductRepository.getMaxDisplayOrder.mockResolvedValue(0);
    mockProductRepository.create.mockResolvedValue(savedProduct);

    await useCase.execute({
      name: 'Product',
      description: '',
      price: 10,
      imageUrl: '',
      categoryIds: [],
    });

    const getMaxOrderOrder =
      mockProductRepository.getMaxDisplayOrder.mock.invocationCallOrder[0];
    const createOrder =
      mockProductRepository.create.mock.invocationCallOrder[0];

    expect(getMaxOrderOrder).toBeLessThan(createOrder);
  });
});
