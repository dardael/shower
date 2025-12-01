import { inject, injectable } from 'tsyringe';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';
import type { IRemoveMenuItem } from '@/application/menu/IRemoveMenuItem';

@injectable()
export class RemoveMenuItem implements IRemoveMenuItem {
  constructor(
    @inject('MenuItemRepository')
    private readonly repository: MenuItemRepository,
    @inject('PageContentRepository')
    private readonly pageContentRepository: IPageContentRepository
  ) {}

  async execute(id: string): Promise<void> {
    const menuItem = await this.repository.findById(id);

    if (!menuItem) {
      throw new Error('Menu item not found');
    }

    // Cascade delete: remove associated page content if exists
    const pageContent = await this.pageContentRepository.findByMenuItemId(id);
    if (pageContent) {
      await this.pageContentRepository.delete(id);
    }

    await this.repository.delete(id);
  }
}
