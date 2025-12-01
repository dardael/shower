import 'reflect-metadata';
import { RemoveMenuItem } from '@/application/menu/RemoveMenuItem';
import { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';
import { MenuItemUrl } from '@/domain/menu/value-objects/MenuItemUrl';
import { PageContent } from '@/domain/pages/entities/PageContent';
import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';

const mockMenuItemRepository: jest.Mocked<MenuItemRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  updatePositions: jest.fn(),
  getNextPosition: jest.fn(),
};

const mockPageContentRepository: jest.Mocked<IPageContentRepository> = {
  findByMenuItemId: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('RemoveMenuItem', () => {
  let useCase: RemoveMenuItem;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RemoveMenuItem(
      mockMenuItemRepository,
      mockPageContentRepository
    );
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
    mockPageContentRepository.findByMenuItemId.mockResolvedValue(null);

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
    mockPageContentRepository.findByMenuItemId.mockResolvedValue(null);

    await useCase.execute('item-id-456');

    const findByIdOrder =
      mockMenuItemRepository.findById.mock.invocationCallOrder[0];
    const deleteOrder =
      mockMenuItemRepository.delete.mock.invocationCallOrder[0];

    expect(findByIdOrder).toBeLessThan(deleteOrder);
  });

  it('should cascade delete associated page content when removing menu item', async () => {
    const existingItem = MenuItem.reconstitute(
      'item-id-789',
      MenuItemText.create('Services'),
      MenuItemUrl.create('/services'),
      2,
      new Date(),
      new Date()
    );
    const existingPageContent = PageContent.reconstitute(
      'page-content-id',
      'item-id-789',
      PageContentBody.create('<p>Services content</p>'),
      new Date(),
      new Date()
    );

    mockMenuItemRepository.findById.mockResolvedValue(existingItem);
    mockPageContentRepository.findByMenuItemId.mockResolvedValue(
      existingPageContent
    );
    mockPageContentRepository.delete.mockResolvedValue();
    mockMenuItemRepository.delete.mockResolvedValue();

    await useCase.execute('item-id-789');

    expect(mockPageContentRepository.findByMenuItemId).toHaveBeenCalledWith(
      'item-id-789'
    );
    expect(mockPageContentRepository.delete).toHaveBeenCalledWith(
      'item-id-789'
    );
    expect(mockMenuItemRepository.delete).toHaveBeenCalledWith('item-id-789');
  });

  it('should not attempt to delete page content when none exists', async () => {
    const existingItem = MenuItem.reconstitute(
      'item-id-empty',
      MenuItemText.create('Contact'),
      MenuItemUrl.create('/contact'),
      3,
      new Date(),
      new Date()
    );

    mockMenuItemRepository.findById.mockResolvedValue(existingItem);
    mockPageContentRepository.findByMenuItemId.mockResolvedValue(null);
    mockMenuItemRepository.delete.mockResolvedValue();

    await useCase.execute('item-id-empty');

    expect(mockPageContentRepository.findByMenuItemId).toHaveBeenCalledWith(
      'item-id-empty'
    );
    expect(mockPageContentRepository.delete).not.toHaveBeenCalled();
    expect(mockMenuItemRepository.delete).toHaveBeenCalledWith('item-id-empty');
  });
});
