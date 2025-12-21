import { SellingEnabled } from '@/domain/settings/value-objects/SellingEnabled';

/**
 * Interface for retrieving selling enabled configuration
 */
export interface IGetSellingEnabled {
  execute(): Promise<SellingEnabled>;
}
