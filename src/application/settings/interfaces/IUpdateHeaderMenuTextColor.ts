import type { HeaderMenuTextColor } from '@/domain/settings/value-objects/HeaderMenuTextColor';

export interface IUpdateHeaderMenuTextColor {
  execute(color: HeaderMenuTextColor): Promise<void>;
}
