import type { BackgroundColor } from '@/domain/settings/value-objects/BackgroundColor';

/**
 * Interface for retrieving website background color use case
 */
export interface IGetBackgroundColor {
  /**
   * Retrieves the current background color for the website
   * @returns Promise resolving to the current background color
   */
  execute(): Promise<BackgroundColor>;
}
