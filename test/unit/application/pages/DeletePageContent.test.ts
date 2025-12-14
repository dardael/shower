import 'reflect-metadata';
import { DeletePageContent } from '@/application/pages/use-cases/DeletePageContent';
import { PageContent } from '@/domain/pages/entities/PageContent';
import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';

const mockPageContentRepository: jest.Mocked<IPageContentRepository> = {
  findAll: jest.fn(),
  findByMenuItemId: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('DeletePageContent', () => {
  let useCase: DeletePageContent;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeletePageContent(mockPageContentRepository);
  });

  it('should delete existing page content', async () => {
    const menuItemId = 'menu-item-123';
    const existingContent = PageContent.reconstitute(
      'page-content-id',
      menuItemId,
      PageContentBody.create('<h1>Content to delete</h1>'),
      new Date('2025-01-01'),
      new Date('2025-01-01')
    );

    mockPageContentRepository.findByMenuItemId.mockResolvedValue(
      existingContent
    );
    mockPageContentRepository.delete.mockResolvedValue();

    await useCase.execute(menuItemId);

    expect(mockPageContentRepository.findByMenuItemId).toHaveBeenCalledWith(
      menuItemId
    );
    expect(mockPageContentRepository.delete).toHaveBeenCalledWith(menuItemId);
  });

  it('should throw error when page content does not exist', async () => {
    const menuItemId = 'non-existent-id';
    mockPageContentRepository.findByMenuItemId.mockResolvedValue(null);

    await expect(useCase.execute(menuItemId)).rejects.toThrow(
      'Page content not found'
    );

    expect(mockPageContentRepository.delete).not.toHaveBeenCalled();
  });
});
