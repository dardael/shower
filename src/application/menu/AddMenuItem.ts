import { inject, injectable } from 'tsyringe';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import type { IAddMenuItem } from '@/application/menu/IAddMenuItem';
import { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';
import { MenuItemUrl } from '@/domain/menu/value-objects/MenuItemUrl';

@injectable()
export class AddMenuItem implements IAddMenuItem {
  constructor(
    @inject('MenuItemRepository')
    private readonly repository: MenuItemRepository
  ) {}

  async execute(text: string, url: string): Promise<MenuItem> {
    const menuItemText = MenuItemText.create(text);
    const menuItemUrl = MenuItemUrl.create(url);
    const nextPosition = await this.repository.getNextPosition();
    const menuItem = MenuItem.create(menuItemText, menuItemUrl, nextPosition);

    // Repository returns the entity with the generated ID
    const savedMenuItem = await this.repository.save(menuItem);

    return savedMenuItem;
  }
}
