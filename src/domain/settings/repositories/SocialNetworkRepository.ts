import { SocialNetwork } from '../entities/SocialNetwork';
import { SocialNetworkType } from '../value-objects/SocialNetworkType';

export interface SocialNetworkRepository {
  getAllSocialNetworks(): Promise<SocialNetwork[]>;
  updateSocialNetworks(socialNetworks: SocialNetwork[]): Promise<void>;
  getSocialNetworkByType(
    type: SocialNetworkType
  ): Promise<SocialNetwork | null>;
}
