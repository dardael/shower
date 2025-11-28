import type { MenuItem } from '@/domain/menu/entities/MenuItem';

export interface IGetMenuItems {
  execute(): Promise<MenuItem[]>;
}
