import type { LoaderBackgroundColor } from '@/domain/settings/value-objects/LoaderBackgroundColor';

export interface IGetLoaderBackgroundColor {
  execute(): Promise<LoaderBackgroundColor>;
}
