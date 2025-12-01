import { injectable, inject } from 'tsyringe';
import type { ICreatePageContent } from '@/application/pages/interfaces/ICreatePageContent';
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import { PageContent } from '@/domain/pages/entities/PageContent';
import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';

@injectable()
export class CreatePageContent implements ICreatePageContent {
  constructor(
    @inject('PageContentRepository')
    private readonly pageContentRepository: IPageContentRepository,
    @inject('MenuItemRepository')
    private readonly menuItemRepository: MenuItemRepository
  ) {}

  async execute(menuItemId: string, content: string): Promise<PageContent> {
    const menuItem = await this.menuItemRepository.findById(menuItemId);
    if (!menuItem) {
      throw new Error('Menu item not found');
    }

    const existingContent =
      await this.pageContentRepository.findByMenuItemId(menuItemId);
    if (existingContent) {
      throw new Error('Page content already exists for this menu item');
    }

    const contentBody = PageContentBody.create(content);
    const pageContent = PageContent.create(menuItemId, contentBody);

    return this.pageContentRepository.save(pageContent);
  }
}
