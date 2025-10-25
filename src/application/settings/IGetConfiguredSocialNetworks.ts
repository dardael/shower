import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';

/**
 * Interface for getting configured social networks
 * Returns only social networks that are enabled and have valid URLs
 */
export interface IGetConfiguredSocialNetworks {
  /**
   * Execute the use case to get all configured social networks
   * @returns Promise<SocialNetwork[]> Array of configured social networks
   */
  execute(): Promise<SocialNetwork[]>;
}
