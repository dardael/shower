import type { BackgroundColor } from '@/domain/settings/value-objects/BackgroundColor';

/**
 * Interface for updating website background color use case
 */
export interface IUpdateBackgroundColor {
  /**
   * Updates the background color for the website
   * @param backgroundColor - The new background color to set
   * @returns Promise resolving when the update is complete
   */
  execute(backgroundColor: BackgroundColor): Promise<void>;
}
