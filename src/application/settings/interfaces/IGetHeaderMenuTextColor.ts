import type { HeaderMenuTextColor } from '@/domain/settings/value-objects/HeaderMenuTextColor';

export interface IGetHeaderMenuTextColor {
  execute(): Promise<HeaderMenuTextColor>;
}
