import { inject, injectable } from 'tsyringe';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import type { IRemoveMenuItem } from '@/application/menu/IRemoveMenuItem';

@injectable()
export class RemoveMenuItem implements IRemoveMenuItem {
  constructor(
    @inject('MenuItemRepository')
    private readonly repository: MenuItemRepository
  ) {}

  async execute(id: string): Promise<void> {
    const menuItem = await this.repository.findById(id);

    if (!menuItem) {
      throw new Error('Menu item not found');
    }

    await this.repository.delete(id);
  }
}
