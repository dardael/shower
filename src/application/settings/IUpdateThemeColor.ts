import type { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';

/**
 * Interface for updating website theme color use case
 */
export interface IUpdateThemeColor {
  /**
   * Updates the theme color for the website
   * @param themeColor - The new theme color to set
   * @returns Promise resolving when the update is complete
   */
  execute(themeColor: ThemeColor): Promise<void>;
}
