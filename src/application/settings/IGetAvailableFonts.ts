import type { FontMetadata } from '@/domain/settings/constants/AvailableFonts';

/**
 * Interface for retrieving available fonts use case
 */
export interface IGetAvailableFonts {
  /**
   * Retrieves the list of available fonts
   * @returns Promise resolving to the list of available fonts
   */
  execute(): Promise<FontMetadata[]>;
}
