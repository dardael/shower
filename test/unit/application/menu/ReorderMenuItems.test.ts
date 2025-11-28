import 'reflect-metadata';
import { ReorderMenuItems } from '@/application/menu/ReorderMenuItems';
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

describe('ReorderMenuItems', () => {
  let useCase: ReorderMenuItems;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ReorderMenuItems(mockMenuItemRepository);
  });

  it('should reorder menu items with valid IDs', async () => {
    const items = [
      MenuItem.reconstitute(
        'id-1',
        MenuItemText.create('Home'),
        0,
        new Date(),
        new Date()
      ),
      MenuItem.reconstitute(
        'id-2',
        MenuItemText.create('About'),
        1,
        new Date(),
        new Date()
      ),
      MenuItem.reconstitute(
        'id-3',
        MenuItemText.create('Contact'),
        2,
        new Date(),
        new Date()
      ),
    ];
    mockMenuItemRepository.findAll.mockResolvedValue(items);
    mockMenuItemRepository.updatePositions.mockResolvedValue();

    await useCase.execute(['id-3', 'id-1', 'id-2']);

    expect(mockMenuItemRepository.updatePositions).toHaveBeenCalledWith([
      { id: 'id-3', position: 0 },
      { id: 'id-1', position: 1 },
      { id: 'id-2', position: 2 },
    ]);
  });

  it('should throw error when invalid IDs are provided', async () => {
    const items = [
      MenuItem.reconstitute(
        'id-1',
        MenuItemText.create('Home'),
        0,
        new Date(),
        new Date()
      ),
    ];
    mockMenuItemRepository.findAll.mockResolvedValue(items);

    await expect(useCase.execute(['id-1', 'invalid-id'])).rejects.toThrow(
      'Invalid item IDs provided'
    );

    expect(mockMenuItemRepository.updatePositions).not.toHaveBeenCalled();
  });

  it('should handle empty ordered IDs array', async () => {
    mockMenuItemRepository.findAll.mockResolvedValue([]);
    mockMenuItemRepository.updatePositions.mockResolvedValue();

    await useCase.execute([]);

    expect(mockMenuItemRepository.updatePositions).toHaveBeenCalledWith([]);
  });

  it('should assign positions based on array index', async () => {
    const items = [
      MenuItem.reconstitute(
        'a',
        MenuItemText.create('First'),
        5,
        new Date(),
        new Date()
      ),
      MenuItem.reconstitute(
        'b',
        MenuItemText.create('Second'),
        10,
        new Date(),
        new Date()
      ),
    ];
    mockMenuItemRepository.findAll.mockResolvedValue(items);
    mockMenuItemRepository.updatePositions.mockResolvedValue();

    await useCase.execute(['b', 'a']);

    expect(mockMenuItemRepository.updatePositions).toHaveBeenCalledWith([
      { id: 'b', position: 0 },
      { id: 'a', position: 1 },
    ]);
  });

  it('should validate all IDs exist before updating positions', async () => {
    const items = [
      MenuItem.reconstitute(
        'id-1',
        MenuItemText.create('Home'),
        0,
        new Date(),
        new Date()
      ),
    ];
    mockMenuItemRepository.findAll.mockResolvedValue(items);

    await expect(useCase.execute(['id-1', 'non-existent'])).rejects.toThrow(
      'Invalid item IDs provided'
    );

    expect(mockMenuItemRepository.findAll).toHaveBeenCalled();
    expect(mockMenuItemRepository.updatePositions).not.toHaveBeenCalled();
  });
});
