import type { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';

/**
 * Interface for retrieving website theme color use case
 */
export interface IGetThemeColor {
  /**
   * Retrieves the current theme color for the website
   * @returns Promise resolving to the current theme color
   */
  execute(): Promise<ThemeColor>;
}
