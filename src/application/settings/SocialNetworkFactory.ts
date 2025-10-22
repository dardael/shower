import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { injectable } from 'tsyringe';

@injectable()
export class SocialNetworkFactory {
  private static defaultNetworksCache: SocialNetwork[] | null = null;

  createDefault(type: SocialNetworkType): SocialNetwork {
    return SocialNetwork.createDefault(type);
  }

  createAllDefaults(): SocialNetwork[] {
    // Cache default social networks to improve performance
    if (!SocialNetworkFactory.defaultNetworksCache) {
      SocialNetworkFactory.defaultNetworksCache = Object.values(
        SocialNetworkType
      ).map((type) => SocialNetwork.createDefault(type));
    }
    // Return a copy to prevent accidental modifications of the cached array
    return [...SocialNetworkFactory.defaultNetworksCache];
  }

  create(
    type: SocialNetworkType,
    url: string,
    label: string,
    enabled: boolean = true
  ): SocialNetwork {
    return SocialNetwork.create(type, url, label, enabled);
  }

  clearCache(): void {
    SocialNetworkFactory.defaultNetworksCache = null;
  }
}
