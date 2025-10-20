import { inject, injectable } from 'tsyringe';
import type { SocialNetworkRepository } from '../../domain/settings/repositories/SocialNetworkRepository';
import type { IUpdateSocialNetworks } from './IUpdateSocialNetworks';
import { SocialNetwork } from '../../domain/settings/entities/SocialNetwork';

@injectable()
export class UpdateSocialNetworks implements IUpdateSocialNetworks {
  constructor(
    @inject('SocialNetworkRepository')
    private readonly repository: SocialNetworkRepository
  ) {}

  async execute(socialNetworks: SocialNetwork[]): Promise<void> {
    await this.repository.updateSocialNetworks(socialNetworks);
  }
}
