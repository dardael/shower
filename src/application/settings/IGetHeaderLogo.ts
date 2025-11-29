import type { HeaderLogo } from '@/domain/settings/value-objects/HeaderLogo';

export interface IGetHeaderLogo {
  execute(): Promise<HeaderLogo | null>;
}
