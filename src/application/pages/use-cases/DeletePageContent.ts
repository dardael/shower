import { injectable, inject } from 'tsyringe';
import type { IDeletePageContent } from '@/application/pages/interfaces/IDeletePageContent';
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';

@injectable()
export class DeletePageContent implements IDeletePageContent {
  constructor(
    @inject('PageContentRepository')
    private readonly pageContentRepository: IPageContentRepository
  ) {}

  async execute(menuItemId: string): Promise<void> {
    const existingContent =
      await this.pageContentRepository.findByMenuItemId(menuItemId);
    if (!existingContent) {
      throw new Error('Page content not found');
    }

    await this.pageContentRepository.delete(menuItemId);
  }
}
