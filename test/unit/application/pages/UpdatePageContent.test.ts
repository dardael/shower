import 'reflect-metadata';
import { UpdatePageContent } from '@/application/pages/use-cases/UpdatePageContent';
import { PageContent } from '@/domain/pages/entities/PageContent';
import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';

const mockPageContentRepository: jest.Mocked<IPageContentRepository> = {
  findAll: jest.fn(),
  findByMenuItemId: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('UpdatePageContent', () => {
  let useCase: UpdatePageContent;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdatePageContent(mockPageContentRepository);
  });

  it('should update existing page content', async () => {
    const menuItemId = 'menu-item-123';
    const existingContent = PageContent.reconstitute(
      'page-content-id',
      menuItemId,
      PageContentBody.create('<h1>Old content</h1>'),
      new Date('2025-01-01'),
      new Date('2025-01-01')
    );
    const newContent = '<h1>Updated content</h1>';

    mockPageContentRepository.findByMenuItemId.mockResolvedValue(
      existingContent
    );
    mockPageContentRepository.save.mockImplementation(
      async (pageContent: PageContent) => pageContent
    );

    const result = await useCase.execute(menuItemId, newContent);

    expect(mockPageContentRepository.findByMenuItemId).toHaveBeenCalledWith(
      menuItemId
    );
    expect(mockPageContentRepository.save).toHaveBeenCalled();
    expect(result.content.value).toBe(newContent);
    expect(result.menuItemId).toBe(menuItemId);
  });

  it('should throw error when page content does not exist', async () => {
    const menuItemId = 'non-existent-id';
    mockPageContentRepository.findByMenuItemId.mockResolvedValue(null);

    await expect(
      useCase.execute(menuItemId, '<p>New content</p>')
    ).rejects.toThrow('Page content not found');

    expect(mockPageContentRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error for empty content', async () => {
    const menuItemId = 'menu-item-123';
    const existingContent = PageContent.reconstitute(
      'page-content-id',
      menuItemId,
      PageContentBody.create('<h1>Old content</h1>'),
      new Date(),
      new Date()
    );

    mockPageContentRepository.findByMenuItemId.mockResolvedValue(
      existingContent
    );

    await expect(useCase.execute(menuItemId, '')).rejects.toThrow(
      'Page content cannot be empty'
    );

    expect(mockPageContentRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error for content exceeding maximum length', async () => {
    const menuItemId = 'menu-item-123';
    const existingContent = PageContent.reconstitute(
      'page-content-id',
      menuItemId,
      PageContentBody.create('<h1>Old content</h1>'),
      new Date(),
      new Date()
    );
    const longContent = 'a'.repeat(100001);

    mockPageContentRepository.findByMenuItemId.mockResolvedValue(
      existingContent
    );

    await expect(useCase.execute(menuItemId, longContent)).rejects.toThrow(
      'Page content cannot exceed 100000 characters'
    );

    expect(mockPageContentRepository.save).not.toHaveBeenCalled();
  });
});
