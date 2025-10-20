import { SocialNetwork } from '../../domain/settings/entities/SocialNetwork';

export interface IGetSocialNetworks {
  execute(): Promise<SocialNetwork[]>;
}
