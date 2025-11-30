import { inject, injectable } from 'tsyringe';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import type { IUpdateMenuItem } from '@/application/menu/IUpdateMenuItem';
import type { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';

@injectable()
export class UpdateMenuItem implements IUpdateMenuItem {
  constructor(
    @inject('MenuItemRepository')
    private readonly repository: MenuItemRepository
  ) {}

  async execute(id: string, text: string): Promise<MenuItem> {
    const existingItem = await this.repository.findById(id);
    if (!existingItem) {
      throw new Error('Menu item not found');
    }

    const menuItemText = MenuItemText.create(text);
    const updatedItem = existingItem.withText(menuItemText);

    return this.repository.save(updatedItem);
  }
}
