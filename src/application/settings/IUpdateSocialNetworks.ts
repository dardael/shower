import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';

export interface IUpdateSocialNetworks {
  execute(socialNetworks: SocialNetwork[]): Promise<void>;
}
