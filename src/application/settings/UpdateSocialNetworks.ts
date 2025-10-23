import { inject, injectable } from 'tsyringe';
import type { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import type { IUpdateSocialNetworks } from '@/application/settings/IUpdateSocialNetworks';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import type { ISocialNetworkUrlNormalizationService } from '@/domain/settings/services/ISocialNetworkUrlNormalizationService';
import { SocialNetworkUrl } from '@/domain/settings/value-objects/SocialNetworkUrl';

@injectable()
export class UpdateSocialNetworks implements IUpdateSocialNetworks {
  constructor(
    @inject('SocialNetworkRepository')
    private readonly repository: SocialNetworkRepository,
    @inject('ISocialNetworkUrlNormalizationService')
    private readonly normalizationService: ISocialNetworkUrlNormalizationService
  ) {}

  async execute(socialNetworks: SocialNetwork[]): Promise<void> {
    const normalizedSocialNetworks = socialNetworks.map((socialNetwork) => {
      if (socialNetwork.url.isEmpty) {
        return socialNetwork;
      }

      const normalizedUrl = SocialNetworkUrl.fromStringWithNormalization(
        socialNetwork.url.value,
        socialNetwork.type.value,
        this.normalizationService
      );

      return SocialNetwork.create(
        socialNetwork.type.value,
        normalizedUrl.value,
        socialNetwork.label.value,
        socialNetwork.enabled
      );
    });

    await this.repository.updateSocialNetworks(normalizedSocialNetworks);
  }
}
