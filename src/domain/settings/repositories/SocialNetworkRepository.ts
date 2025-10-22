import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';

export interface SocialNetworkRepository {
  getAllSocialNetworks(): Promise<SocialNetwork[]>;
  updateSocialNetworks(socialNetworks: SocialNetwork[]): Promise<void>;
  getSocialNetworkByType(
    type: SocialNetworkType
  ): Promise<SocialNetwork | null>;
}
