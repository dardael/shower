import 'reflect-metadata';
import { GetPageContent } from '@/application/pages/use-cases/GetPageContent';
import { PageContent } from '@/domain/pages/entities/PageContent';
import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';

const mockPageContentRepository: jest.Mocked<IPageContentRepository> = {
  findByMenuItemId: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('GetPageContent', () => {
  let useCase: GetPageContent;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetPageContent(mockPageContentRepository);
  });

  it('should return page content when it exists', async () => {
    const menuItemId = 'menu-item-123';
    const existingContent = PageContent.reconstitute(
      'page-content-id',
      menuItemId,
      PageContentBody.create('<h1>Test</h1>'),
      new Date(),
      new Date()
    );

    mockPageContentRepository.findByMenuItemId.mockResolvedValue(
      existingContent
    );

    const result = await useCase.execute(menuItemId);

    expect(mockPageContentRepository.findByMenuItemId).toHaveBeenCalledWith(
      menuItemId
    );
    expect(result).not.toBeNull();
    expect(result?.id).toBe('page-content-id');
    expect(result?.menuItemId).toBe(menuItemId);
    expect(result?.content.value).toBe('<h1>Test</h1>');
  });

  it('should return null when page content does not exist', async () => {
    const menuItemId = 'non-existent-menu-item';

    mockPageContentRepository.findByMenuItemId.mockResolvedValue(null);

    const result = await useCase.execute(menuItemId);

    expect(mockPageContentRepository.findByMenuItemId).toHaveBeenCalledWith(
      menuItemId
    );
    expect(result).toBeNull();
  });
});
