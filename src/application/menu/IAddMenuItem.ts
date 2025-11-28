import type { MenuItem } from '@/domain/menu/entities/MenuItem';

export interface IAddMenuItem {
  execute(text: string): Promise<MenuItem>;
}
