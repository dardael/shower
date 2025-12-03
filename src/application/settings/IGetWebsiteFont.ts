import type { WebsiteFont } from '@/domain/settings/value-objects/WebsiteFont';

/**
 * Interface for retrieving website font use case
 */
export interface IGetWebsiteFont {
  /**
   * Retrieves the current font for the website
   * @returns Promise resolving to the current website font
   */
  execute(): Promise<WebsiteFont>;
}
