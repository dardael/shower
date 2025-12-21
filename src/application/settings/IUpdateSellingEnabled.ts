import { SellingEnabled } from '@/domain/settings/value-objects/SellingEnabled';

/**
 * Interface for updating selling enabled configuration
 */
export interface IUpdateSellingEnabled {
  execute(sellingEnabled: SellingEnabled): Promise<void>;
}
