import { inject, injectable } from 'tsyringe';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import type { IReorderMenuItems } from '@/application/menu/IReorderMenuItems';

@injectable()
export class ReorderMenuItems implements IReorderMenuItems {
  constructor(
    @inject('MenuItemRepository')
    private readonly repository: MenuItemRepository
  ) {}

  async execute(orderedIds: string[]): Promise<void> {
    const existingItems = await this.repository.findAll();
    const existingIds = new Set(existingItems.map((item) => item.id));

    for (const id of orderedIds) {
      if (!existingIds.has(id)) {
        throw new Error('Invalid item IDs provided');
      }
    }

    const positionUpdates = orderedIds.map((id, index) => ({
      id,
      position: index,
    }));

    await this.repository.updatePositions(positionUpdates);
  }
}
