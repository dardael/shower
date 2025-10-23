import { inject, injectable } from 'tsyringe';
import type { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import type { IUpdateSocialNetworks } from '@/application/settings/IUpdateSocialNetworks';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import type { ISocialNetworkUrlNormalizationService } from '@/domain/settings/services/ISocialNetworkUrlNormalizationService';
import { SocialNetworkUrl } from '@/domain/settings/value-objects/SocialNetworkUrl';
import { Logger } from '@/application/shared/Logger';

@injectable()
export class UpdateSocialNetworks implements IUpdateSocialNetworks {
  constructor(
    @inject('SocialNetworkRepository')
    private readonly repository: SocialNetworkRepository,
    @inject('ISocialNetworkUrlNormalizationService')
    private readonly normalizationService: ISocialNetworkUrlNormalizationService,
    @inject('Logger')
    private readonly logger: Logger
  ) {}

  async execute(socialNetworks: SocialNetwork[]): Promise<void> {
    await this.repository.updateSocialNetworks(socialNetworks);
  }
}
