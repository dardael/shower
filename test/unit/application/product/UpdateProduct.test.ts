import 'reflect-metadata';
import { UpdateProduct } from '@/application/product/UpdateProduct';
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

describe('UpdateProduct', () => {
  let useCase: UpdateProduct;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateProduct(mockProductRepository);
  });

  it('should update product name', async () => {
    const existingProduct = Product.create({
      name: 'Old Name',
      description: 'Description',
      price: 100,
      imageUrl: '/image.jpg',
      categoryIds: [],
    });
    const updatedProduct = existingProduct.withName('New Name');

    mockProductRepository.getById.mockResolvedValue(existingProduct);
    mockProductRepository.update.mockResolvedValue(updatedProduct);

    const result = await useCase.execute('product-id', { name: 'New Name' });

    expect(mockProductRepository.getById).toHaveBeenCalledWith('product-id');
    expect(mockProductRepository.update).toHaveBeenCalled();
    expect(result?.name).toBe('New Name');
  });

  it('should update product description', async () => {
    const existingProduct = Product.create({
      name: 'Product',
      description: 'Old Description',
      price: 100,
      imageUrl: '',
      categoryIds: [],
    });
    const updatedProduct = existingProduct.withDescription('New Description');

    mockProductRepository.getById.mockResolvedValue(existingProduct);
    mockProductRepository.update.mockResolvedValue(updatedProduct);

    const result = await useCase.execute('product-id', {
      description: 'New Description',
    });

    expect(result?.description).toBe('New Description');
  });

  it('should update product price', async () => {
    const existingProduct = Product.create({
      name: 'Product',
      description: '',
      price: 100,
      imageUrl: '',
      categoryIds: [],
    });
    const updatedProduct = existingProduct.withPrice(199.99);

    mockProductRepository.getById.mockResolvedValue(existingProduct);
    mockProductRepository.update.mockResolvedValue(updatedProduct);

    const result = await useCase.execute('product-id', { price: 199.99 });

    expect(result?.price).toBe(199.99);
  });

  it('should update product imageUrl', async () => {
    const existingProduct = Product.create({
      name: 'Product',
      description: '',
      price: 100,
      imageUrl: '/old-image.jpg',
      categoryIds: [],
    });
    const updatedProduct = existingProduct.withImageUrl('/new-image.jpg');

    mockProductRepository.getById.mockResolvedValue(existingProduct);
    mockProductRepository.update.mockResolvedValue(updatedProduct);

    const result = await useCase.execute('product-id', {
      imageUrl: '/new-image.jpg',
    });

    expect(result?.imageUrl).toBe('/new-image.jpg');
  });

  it('should update product categoryIds', async () => {
    const existingProduct = Product.create({
      name: 'Product',
      description: '',
      price: 100,
      imageUrl: '',
      categoryIds: ['cat-1'],
    });
    const updatedProduct = existingProduct.withCategoryIds(['cat-2', 'cat-3']);

    mockProductRepository.getById.mockResolvedValue(existingProduct);
    mockProductRepository.update.mockResolvedValue(updatedProduct);

    const result = await useCase.execute('product-id', {
      categoryIds: ['cat-2', 'cat-3'],
    });

    expect(result?.categoryIds).toEqual(['cat-2', 'cat-3']);
  });

  it('should update multiple fields at once', async () => {
    const existingProduct = Product.create({
      name: 'Old Name',
      description: 'Old Description',
      price: 100,
      imageUrl: '/old.jpg',
      categoryIds: ['cat-1'],
    });
    const updatedProduct = existingProduct
      .withName('New Name')
      .withDescription('New Description')
      .withPrice(200)
      .withImageUrl('/new.jpg')
      .withCategoryIds(['cat-2']);

    mockProductRepository.getById.mockResolvedValue(existingProduct);
    mockProductRepository.update.mockResolvedValue(updatedProduct);

    const result = await useCase.execute('product-id', {
      name: 'New Name',
      description: 'New Description',
      price: 200,
      imageUrl: '/new.jpg',
      categoryIds: ['cat-2'],
    });

    expect(result?.name).toBe('New Name');
    expect(result?.description).toBe('New Description');
    expect(result?.price).toBe(200);
    expect(result?.imageUrl).toBe('/new.jpg');
    expect(result?.categoryIds).toEqual(['cat-2']);
  });

  it('should return null when product does not exist', async () => {
    mockProductRepository.getById.mockResolvedValue(null);

    const result = await useCase.execute('non-existent-id', {
      name: 'New Name',
    });

    expect(mockProductRepository.getById).toHaveBeenCalledWith(
      'non-existent-id'
    );
    expect(mockProductRepository.update).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should throw error when updating to empty name', async () => {
    const existingProduct = Product.create({
      name: 'Valid Name',
      description: '',
      price: 100,
      imageUrl: '',
      categoryIds: [],
    });

    mockProductRepository.getById.mockResolvedValue(existingProduct);

    await expect(useCase.execute('product-id', { name: '' })).rejects.toThrow(
      'Product name is required'
    );

    expect(mockProductRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when updating to name exceeding 200 characters', async () => {
    const existingProduct = Product.create({
      name: 'Valid Name',
      description: '',
      price: 100,
      imageUrl: '',
      categoryIds: [],
    });
    const longName = 'a'.repeat(201);

    mockProductRepository.getById.mockResolvedValue(existingProduct);

    await expect(
      useCase.execute('product-id', { name: longName })
    ).rejects.toThrow('Product name must be 200 characters or less');

    expect(mockProductRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when updating to zero price', async () => {
    const existingProduct = Product.create({
      name: 'Product',
      description: '',
      price: 100,
      imageUrl: '',
      categoryIds: [],
    });

    mockProductRepository.getById.mockResolvedValue(existingProduct);

    await expect(useCase.execute('product-id', { price: 0 })).rejects.toThrow(
      'Product price must be greater than 0'
    );

    expect(mockProductRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when updating to negative price', async () => {
    const existingProduct = Product.create({
      name: 'Product',
      description: '',
      price: 100,
      imageUrl: '',
      categoryIds: [],
    });

    mockProductRepository.getById.mockResolvedValue(existingProduct);

    await expect(useCase.execute('product-id', { price: -50 })).rejects.toThrow(
      'Product price must be greater than 0'
    );

    expect(mockProductRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when updating to description exceeding 5000 characters', async () => {
    const existingProduct = Product.create({
      name: 'Product',
      description: 'Valid',
      price: 100,
      imageUrl: '',
      categoryIds: [],
    });
    const longDescription = 'a'.repeat(5001);

    mockProductRepository.getById.mockResolvedValue(existingProduct);

    await expect(
      useCase.execute('product-id', { description: longDescription })
    ).rejects.toThrow('Product description must be 5000 characters or less');

    expect(mockProductRepository.update).not.toHaveBeenCalled();
  });

  it('should call getById before update', async () => {
    const existingProduct = Product.create({
      name: 'Product',
      description: '',
      price: 100,
      imageUrl: '',
      categoryIds: [],
    });

    mockProductRepository.getById.mockResolvedValue(existingProduct);
    mockProductRepository.update.mockResolvedValue(existingProduct);

    await useCase.execute('product-id', { name: 'Updated' });

    const getByIdOrder =
      mockProductRepository.getById.mock.invocationCallOrder[0];
    const updateOrder =
      mockProductRepository.update.mock.invocationCallOrder[0];

    expect(getByIdOrder).toBeLessThan(updateOrder);
  });
});
