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
    const existingNetworks = await this.repository.getAllSocialNetworks();
    const allDefaults = this.factory.createAllDefaults();

    // If no social networks exist, return all defaults
    if (existingNetworks.length === 0) {
      return allDefaults;
    }

    // Merge existing data with defaults to ensure all types are present
    return allDefaults.map((defaultNetwork) => {
      const existing = existingNetworks.find(
        (network) => network.type.value === defaultNetwork.type.value
      );
      return existing || defaultNetwork;
    });
  }
}
