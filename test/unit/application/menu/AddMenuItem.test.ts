import 'reflect-metadata';
import { AddMenuItem } from '@/application/menu/AddMenuItem';
import { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';

const mockMenuItemRepository: jest.Mocked<MenuItemRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  updatePositions: jest.fn(),
  getNextPosition: jest.fn(),
};

describe('AddMenuItem', () => {
  let useCase: AddMenuItem;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new AddMenuItem(mockMenuItemRepository);
  });

  it('should create and save a menu item with valid text', async () => {
    const savedItem = MenuItem.reconstitute(
      'mongo-id-123',
      MenuItemText.create('Home'),
      0,
      new Date(),
      new Date()
    );
    mockMenuItemRepository.getNextPosition.mockResolvedValue(0);
    mockMenuItemRepository.save.mockResolvedValue(savedItem);

    const result = await useCase.execute('Home');

    expect(mockMenuItemRepository.getNextPosition).toHaveBeenCalled();
    expect(mockMenuItemRepository.save).toHaveBeenCalled();
    expect(result.text.value).toBe('Home');
    expect(result.position).toBe(0);
    expect(result.id).toBe('mongo-id-123');
  });

  it('should assign the next available position', async () => {
    const savedItem = MenuItem.reconstitute(
      'mongo-id-456',
      MenuItemText.create('About'),
      3,
      new Date(),
      new Date()
    );
    mockMenuItemRepository.getNextPosition.mockResolvedValue(3);
    mockMenuItemRepository.save.mockResolvedValue(savedItem);

    const result = await useCase.execute('About');

    expect(result.position).toBe(3);
    expect(result.id).toBe('mongo-id-456');
  });

  it('should throw error for empty text', async () => {
    await expect(useCase.execute('')).rejects.toThrow(
      'Menu item text cannot be empty'
    );

    expect(mockMenuItemRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error for whitespace-only text', async () => {
    await expect(useCase.execute('   ')).rejects.toThrow(
      'Menu item text cannot be empty'
    );

    expect(mockMenuItemRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error for text exceeding 100 characters', async () => {
    const longText = 'a'.repeat(101);

    await expect(useCase.execute(longText)).rejects.toThrow(
      'Menu item text cannot exceed 100 characters'
    );

    expect(mockMenuItemRepository.save).not.toHaveBeenCalled();
  });

  it('should trim whitespace from text', async () => {
    const savedItem = MenuItem.reconstitute(
      'mongo-id-789',
      MenuItemText.create('Contact'),
      0,
      new Date(),
      new Date()
    );
    mockMenuItemRepository.getNextPosition.mockResolvedValue(0);
    mockMenuItemRepository.save.mockResolvedValue(savedItem);

    const result = await useCase.execute('  Contact  ');

    expect(result.text.value).toBe('Contact');
  });
});
