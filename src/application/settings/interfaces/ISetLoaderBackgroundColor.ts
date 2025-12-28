import type { LoaderBackgroundColor } from '@/domain/settings/value-objects/LoaderBackgroundColor';

export interface ISetLoaderBackgroundColor {
  execute(color: LoaderBackgroundColor | null): Promise<void>;
}
