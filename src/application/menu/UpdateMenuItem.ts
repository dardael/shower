import { inject, injectable } from 'tsyringe';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import type { IUpdateMenuItem } from '@/application/menu/IUpdateMenuItem';
import type { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';
import { MenuItemUrl } from '@/domain/menu/value-objects/MenuItemUrl';

@injectable()
export class UpdateMenuItem implements IUpdateMenuItem {
  constructor(
    @inject('MenuItemRepository')
    private readonly repository: MenuItemRepository
  ) {}

  async execute(id: string, text: string, url: string): Promise<MenuItem> {
    const existingItem = await this.repository.findById(id);
    if (!existingItem) {
      throw new Error('Menu item not found');
    }

    const menuItemText = MenuItemText.create(text);
    const menuItemUrl = MenuItemUrl.create(url);
    const updatedItem = existingItem
      .withText(menuItemText)
      .withUrl(menuItemUrl);

    return this.repository.save(updatedItem);
  }
}
