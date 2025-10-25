import { inject, injectable } from 'tsyringe';
import type { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import type { IGetConfiguredSocialNetworks } from './IGetConfiguredSocialNetworks';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { Logger } from '@/application/shared/Logger';

/**
 * Use case for getting configured social networks
 * Returns only social networks that are enabled and have valid URLs
 */
@injectable()
export class GetConfiguredSocialNetworks
  implements IGetConfiguredSocialNetworks
{
  constructor(
    @inject('SocialNetworkRepository')
    private readonly repository: SocialNetworkRepository,
    @inject('Logger')
    private readonly logger: Logger
  ) {}

  async execute(): Promise<SocialNetwork[]> {
    this.logger.info('Getting configured social networks', {
      operation: 'GetConfiguredSocialNetworks.execute',
    });

    try {
      const allSocialNetworks = await this.repository.getAllSocialNetworks();

      // Filter only configured social networks (enabled and with valid URLs)
      const configuredNetworks = allSocialNetworks.filter((network) =>
        network.isConfigured()
      );

      this.logger.info('Retrieved configured social networks', {
        count: configuredNetworks.length,
        totalCount: allSocialNetworks.length,
        operation: 'GetConfiguredSocialNetworks.execute',
      });

      return configuredNetworks;
    } catch (error) {
      this.logger.logError(error, 'Failed to get configured social networks', {
        operation: 'GetConfiguredSocialNetworks.execute',
      });
      throw error;
    }
  }
}
