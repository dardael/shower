import { inject, injectable } from 'tsyringe';
import type { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import type { IGetSocialNetworks } from './IGetSocialNetworks';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';

@injectable()
export class GetSocialNetworks implements IGetSocialNetworks {
  constructor(
    @inject('SocialNetworkRepository')
    private readonly repository: SocialNetworkRepository
  ) {}

  async execute(): Promise<SocialNetwork[]> {
    return await this.repository.getAllSocialNetworks();
  }
}
