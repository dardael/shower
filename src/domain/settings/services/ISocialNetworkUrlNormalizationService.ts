import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';

export interface ISocialNetworkUrlNormalizationService {
  /**
   * Normalizes a URL by auto-prepending the appropriate protocol if missing
   * @param url - The URL to normalize
   * @param type - The social network type
   * @returns The normalized URL
   */
  normalizeUrl(url: string, type: SocialNetworkType): string;

  /**
   * Checks if a URL requires normalization
   * @param url - The URL to check
   * @param type - The social network type
   * @returns True if normalization is required
   */
  requiresNormalization(url: string, type: SocialNetworkType): boolean;
}
