import 'reflect-metadata';
import { RemoveMenuItem } from '@/application/menu/RemoveMenuItem';
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

describe('RemoveMenuItem', () => {
  let useCase: RemoveMenuItem;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RemoveMenuItem(mockMenuItemRepository);
  });

  it('should remove an existing menu item', async () => {
    const existingItem = MenuItem.reconstitute(
      'item-id-123',
      MenuItemText.create('Home'),
      MenuItemUrl.create('/home'),
      0,
      new Date(),
      new Date()
    );
    mockMenuItemRepository.findById.mockResolvedValue(existingItem);
    mockMenuItemRepository.delete.mockResolvedValue();

    await useCase.execute('item-id-123');

    expect(mockMenuItemRepository.findById).toHaveBeenCalledWith('item-id-123');
    expect(mockMenuItemRepository.delete).toHaveBeenCalledWith('item-id-123');
  });

  it('should throw error when menu item does not exist', async () => {
    mockMenuItemRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent-id')).rejects.toThrow(
      'Menu item not found'
    );

    expect(mockMenuItemRepository.findById).toHaveBeenCalledWith(
      'non-existent-id'
    );
    expect(mockMenuItemRepository.delete).not.toHaveBeenCalled();
  });

  it('should call findById before delete', async () => {
    const existingItem = MenuItem.reconstitute(
      'item-id-456',
      MenuItemText.create('About'),
      MenuItemUrl.create('/about'),
      1,
      new Date(),
      new Date()
    );
    mockMenuItemRepository.findById.mockResolvedValue(existingItem);
    mockMenuItemRepository.delete.mockResolvedValue();

    await useCase.execute('item-id-456');

    const findByIdOrder =
      mockMenuItemRepository.findById.mock.invocationCallOrder[0];
    const deleteOrder =
      mockMenuItemRepository.delete.mock.invocationCallOrder[0];

    expect(findByIdOrder).toBeLessThan(deleteOrder);
  });
});
