import type { HeaderLogo } from '@/domain/settings/value-objects/HeaderLogo';

export interface IUpdateHeaderLogo {
  execute(logo: HeaderLogo | null): Promise<void>;
}
