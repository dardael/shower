import type { MenuItem } from '@/domain/menu/entities/MenuItem';

export interface MenuItemRepository {
  findAll(): Promise<MenuItem[]>;
  findById(id: string): Promise<MenuItem | null>;
  save(menuItem: MenuItem): Promise<MenuItem>;
  delete(id: string): Promise<void>;
  updatePositions(
    items: Array<{ id: string; position: number }>
  ): Promise<void>;
  getNextPosition(): Promise<number>;
}
