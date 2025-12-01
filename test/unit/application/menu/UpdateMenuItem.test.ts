import 'reflect-metadata';
import { UpdateMenuItem } from '@/application/menu/UpdateMenuItem';
import { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';
import { MenuItemUrl } from '@/domain/menu/value-objects/MenuItemUrl';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';

const mockMenuItemRepository: jest.Mocked<MenuItemRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  updatePositions: jest.fn(),
  getNextPosition: jest.fn(),
};

describe('UpdateMenuItem', () => {
  let useCase: UpdateMenuItem;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateMenuItem(mockMenuItemRepository);
  });

  it('should update menu item text and url and save', async () => {
    const existingItem = MenuItem.reconstitute(
      'item-id-123',
      MenuItemText.create('Original Text'),
      MenuItemUrl.create('/original'),
      2,
      new Date('2024-01-01'),
      new Date('2024-01-02')
    );
    const updatedItem = existingItem
      .withText(MenuItemText.create('Updated Text'))
      .withUrl(MenuItemUrl.create('/updated'));

    mockMenuItemRepository.findById.mockResolvedValue(existingItem);
    mockMenuItemRepository.save.mockResolvedValue(updatedItem);

    const result = await useCase.execute(
      'item-id-123',
      'Updated Text',
      '/updated'
    );

    expect(mockMenuItemRepository.findById).toHaveBeenCalledWith('item-id-123');
    expect(mockMenuItemRepository.save).toHaveBeenCalled();
    expect(result.text.value).toBe('Updated Text');
    expect(result.url.value).toBe('/updated');
  });

  it('should preserve the menu item position after update', async () => {
    const existingItem = MenuItem.reconstitute(
      'item-id-123',
      MenuItemText.create('Original'),
      MenuItemUrl.create('/original'),
      5,
      new Date(),
      new Date()
    );
    const updatedItem = existingItem
      .withText(MenuItemText.create('Updated'))
      .withUrl(MenuItemUrl.create('/updated'));

    mockMenuItemRepository.findById.mockResolvedValue(existingItem);
    mockMenuItemRepository.save.mockResolvedValue(updatedItem);

    const result = await useCase.execute('item-id-123', 'Updated', '/updated');

    expect(result.position).toBe(5);
  });

  it('should preserve the menu item id after update', async () => {
    const existingItem = MenuItem.reconstitute(
      'original-id',
      MenuItemText.create('Original'),
      MenuItemUrl.create('/original'),
      0,
      new Date(),
      new Date()
    );
    const updatedItem = existingItem
      .withText(MenuItemText.create('Updated'))
      .withUrl(MenuItemUrl.create('/updated'));

    mockMenuItemRepository.findById.mockResolvedValue(existingItem);
    mockMenuItemRepository.save.mockResolvedValue(updatedItem);

    const result = await useCase.execute('original-id', 'Updated', '/updated');

    expect(result.id).toBe('original-id');
  });

  it('should throw error when menu item is not found', async () => {
    mockMenuItemRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('non-existent-id', 'New Text', '/new')
    ).rejects.toThrow('Menu item not found');

    expect(mockMenuItemRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error for empty text', async () => {
    const existingItem = MenuItem.reconstitute(
      'item-id',
      MenuItemText.create('Original'),
      MenuItemUrl.create('/original'),
      0,
      new Date(),
      new Date()
    );
    mockMenuItemRepository.findById.mockResolvedValue(existingItem);

    await expect(useCase.execute('item-id', '', '/url')).rejects.toThrow(
      'Menu item text cannot be empty'
    );

    expect(mockMenuItemRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error for whitespace-only text', async () => {
    const existingItem = MenuItem.reconstitute(
      'item-id',
      MenuItemText.create('Original'),
      MenuItemUrl.create('/original'),
      0,
      new Date(),
      new Date()
    );
    mockMenuItemRepository.findById.mockResolvedValue(existingItem);

    await expect(useCase.execute('item-id', '   ', '/url')).rejects.toThrow(
      'Menu item text cannot be empty'
    );

    expect(mockMenuItemRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error for text exceeding 100 characters', async () => {
    const existingItem = MenuItem.reconstitute(
      'item-id',
      MenuItemText.create('Original'),
      MenuItemUrl.create('/original'),
      0,
      new Date(),
      new Date()
    );
    mockMenuItemRepository.findById.mockResolvedValue(existingItem);
    const longText = 'a'.repeat(101);

    await expect(useCase.execute('item-id', longText, '/url')).rejects.toThrow(
      'Menu item text cannot exceed 100 characters'
    );

    expect(mockMenuItemRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error for empty url', async () => {
    const existingItem = MenuItem.reconstitute(
      'item-id',
      MenuItemText.create('Original'),
      MenuItemUrl.create('/original'),
      0,
      new Date(),
      new Date()
    );
    mockMenuItemRepository.findById.mockResolvedValue(existingItem);

    await expect(useCase.execute('item-id', 'Text', '')).rejects.toThrow(
      'Menu item URL cannot be empty'
    );

    expect(mockMenuItemRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error for absolute url', async () => {
    const existingItem = MenuItem.reconstitute(
      'item-id',
      MenuItemText.create('Original'),
      MenuItemUrl.create('/original'),
      0,
      new Date(),
      new Date()
    );
    mockMenuItemRepository.findById.mockResolvedValue(existingItem);

    await expect(
      useCase.execute('item-id', 'Text', 'https://example.com')
    ).rejects.toThrow('Menu item URL must be a relative path');

    expect(mockMenuItemRepository.save).not.toHaveBeenCalled();
  });

  it('should trim whitespace from text before saving', async () => {
    const existingItem = MenuItem.reconstitute(
      'item-id',
      MenuItemText.create('Original'),
      MenuItemUrl.create('/original'),
      0,
      new Date(),
      new Date()
    );
    const updatedItem = existingItem
      .withText(MenuItemText.create('Trimmed'))
      .withUrl(MenuItemUrl.create('/url'));

    mockMenuItemRepository.findById.mockResolvedValue(existingItem);
    mockMenuItemRepository.save.mockResolvedValue(updatedItem);

    const result = await useCase.execute('item-id', '  Trimmed  ', '/url');

    expect(result.text.value).toBe('Trimmed');
  });

  it('should call save with the updated menu item', async () => {
    const existingItem = MenuItem.reconstitute(
      'item-id',
      MenuItemText.create('Original'),
      MenuItemUrl.create('/original'),
      3,
      new Date('2024-01-01'),
      new Date('2024-01-02')
    );

    mockMenuItemRepository.findById.mockResolvedValue(existingItem);
    mockMenuItemRepository.save.mockImplementation(async (item) => item);

    await useCase.execute('item-id', 'New Text', '/new-url');

    const savedItem = mockMenuItemRepository.save.mock.calls[0][0];
    expect(savedItem.text.value).toBe('New Text');
    expect(savedItem.url.value).toBe('/new-url');
    expect(savedItem.id).toBe('item-id');
    expect(savedItem.position).toBe(3);
  });
});
