import { injectable, inject } from 'tsyringe';
import type { IUpdatePageContent } from '@/application/pages/interfaces/IUpdatePageContent';
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';
import type { PageContent } from '@/domain/pages/entities/PageContent';
import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';

@injectable()
export class UpdatePageContent implements IUpdatePageContent {
  constructor(
    @inject('PageContentRepository')
    private readonly pageContentRepository: IPageContentRepository
  ) {}

  async execute(menuItemId: string, content: string): Promise<PageContent> {
    const existingContent =
      await this.pageContentRepository.findByMenuItemId(menuItemId);
    if (!existingContent) {
      throw new Error('Page content not found');
    }

    const contentBody = PageContentBody.create(content);
    const updatedPageContent = existingContent.withContent(contentBody);

    return this.pageContentRepository.save(updatedPageContent);
  }
}
