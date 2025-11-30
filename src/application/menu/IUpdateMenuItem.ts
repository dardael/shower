import type { MenuItem } from '@/domain/menu/entities/MenuItem';

export interface IUpdateMenuItem {
  execute(id: string, text: string): Promise<MenuItem>;
}
