import { inject, injectable } from 'tsyringe';
import type { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import type { IGetSocialNetworks } from './IGetSocialNetworks';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkFactory } from './SocialNetworkFactory';

@injectable()
export class GetSocialNetworks implements IGetSocialNetworks {
  constructor(
    @inject('SocialNetworkRepository')
    private readonly repository: SocialNetworkRepository,
    @inject('SocialNetworkFactory')
    private readonly factory: SocialNetworkFactory
  ) {}

  async execute(): Promise<SocialNetwork[]> {
    const socialNetworks = await this.repository.getAllSocialNetworks();

    // If no social networks exist, return defaults
    if (socialNetworks.length === 0) {
      return this.factory.createAllDefaults();
    }

    return socialNetworks;
  }
}
