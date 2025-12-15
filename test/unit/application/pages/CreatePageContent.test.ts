import 'reflect-metadata';
import { CreatePageContent } from '@/application/pages/use-cases/CreatePageContent';
import { PageContent } from '@/domain/pages/entities/PageContent';
import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';
import { MenuItemUrl } from '@/domain/menu/value-objects/MenuItemUrl';

const mockPageContentRepository: jest.Mocked<IPageContentRepository> = {
  findAll: jest.fn(),
  findByMenuItemId: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockMenuItemRepository: jest.Mocked<MenuItemRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  updatePositions: jest.fn(),
  getNextPosition: jest.fn(),
};

describe('CreatePageContent', () => {
  let useCase: CreatePageContent;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreatePageContent(
      mockPageContentRepository,
      mockMenuItemRepository
    );
  });

  it('should create and save page content for existing menu item', async () => {
    const menuItemId = 'menu-item-123';
    const content = '<h1>Welcome</h1><p>Test content</p>';
    const menuItem = MenuItem.reconstitute(
      menuItemId,
      MenuItemText.create('Home'),
      MenuItemUrl.create('/'),
      0,
      new Date(),
      new Date()
    );

    mockMenuItemRepository.findById.mockResolvedValue(menuItem);
    mockPageContentRepository.findByMenuItemId.mockResolvedValue(null);

    const savedPageContent = PageContent.reconstitute(
      'page-content-id',
      menuItemId,
      PageContentBody.create(content),
      new Date(),
      new Date()
    );
    mockPageContentRepository.save.mockResolvedValue(savedPageContent);

    const result = await useCase.execute(menuItemId, content);

    expect(mockMenuItemRepository.findById).toHaveBeenCalledWith(menuItemId);
    expect(mockPageContentRepository.findByMenuItemId).toHaveBeenCalledWith(
      menuItemId
    );
    expect(mockPageContentRepository.save).toHaveBeenCalled();
    expect(result.menuItemId).toBe(menuItemId);
    expect(result.content.value).toBe(content);
    expect(result.id).toBe('page-content-id');
  });

  it('should throw error when menu item does not exist', async () => {
    const menuItemId = 'non-existent-id';
    mockMenuItemRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(menuItemId, '<p>Content</p>')).rejects.toThrow(
      'Menu item not found'
    );

    expect(mockPageContentRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when page content already exists for menu item', async () => {
    const menuItemId = 'menu-item-123';
    const menuItem = MenuItem.reconstitute(
      menuItemId,
      MenuItemText.create('Home'),
      MenuItemUrl.create('/'),
      0,
      new Date(),
      new Date()
    );
    const existingContent = PageContent.reconstitute(
      'existing-id',
      menuItemId,
      PageContentBody.create('<p>Existing</p>'),
      new Date(),
      new Date()
    );

    mockMenuItemRepository.findById.mockResolvedValue(menuItem);
    mockPageContentRepository.findByMenuItemId.mockResolvedValue(
      existingContent
    );

    await expect(
      useCase.execute(menuItemId, '<p>New content</p>')
    ).rejects.toThrow('Page content already exists for this menu item');

    expect(mockPageContentRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error for empty content', async () => {
    const menuItemId = 'menu-item-123';
    const menuItem = MenuItem.reconstitute(
      menuItemId,
      MenuItemText.create('Home'),
      MenuItemUrl.create('/'),
      0,
      new Date(),
      new Date()
    );

    mockMenuItemRepository.findById.mockResolvedValue(menuItem);
    mockPageContentRepository.findByMenuItemId.mockResolvedValue(null);

    await expect(useCase.execute(menuItemId, '')).rejects.toThrow(
      'Page content cannot be empty'
    );

    expect(mockPageContentRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error for content exceeding maximum length', async () => {
    const menuItemId = 'menu-item-123';
    const menuItem = MenuItem.reconstitute(
      menuItemId,
      MenuItemText.create('Home'),
      MenuItemUrl.create('/'),
      0,
      new Date(),
      new Date()
    );
    const longContent = 'a'.repeat(100001);

    mockMenuItemRepository.findById.mockResolvedValue(menuItem);
    mockPageContentRepository.findByMenuItemId.mockResolvedValue(null);

    await expect(useCase.execute(menuItemId, longContent)).rejects.toThrow(
      'Page content cannot exceed 100000 characters'
    );

    expect(mockPageContentRepository.save).not.toHaveBeenCalled();
  });
});
