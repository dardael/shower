import { inject, injectable } from 'tsyringe';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import type { IGetMenuItems } from '@/application/menu/IGetMenuItems';
import type { MenuItem } from '@/domain/menu/entities/MenuItem';

@injectable()
export class GetMenuItems implements IGetMenuItems {
  constructor(
    @inject('MenuItemRepository')
    private readonly repository: MenuItemRepository
  ) {}

  async execute(): Promise<MenuItem[]> {
    return this.repository.findAll();
  }
}
