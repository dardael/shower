import type { WebsiteFont } from '@/domain/settings/value-objects/WebsiteFont';

/**
 * Interface for updating website font use case
 */
export interface IUpdateWebsiteFont {
  /**
   * Updates the font for the website
   * @param websiteFont - The new font to set
   * @returns Promise resolving when the update is complete
   */
  execute(websiteFont: WebsiteFont): Promise<void>;
}
