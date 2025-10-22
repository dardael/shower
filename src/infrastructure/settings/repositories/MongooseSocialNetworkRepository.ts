import { inject, injectable } from 'tsyringe';
import { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { SocialNetworkTypeValueObject } from '@/domain/settings/value-objects/SocialNetworkType';
import { SocialNetworkUrl } from '@/domain/settings/value-objects/SocialNetworkUrl';
import { SocialNetworkLabel } from '@/domain/settings/value-objects/SocialNetworkLabel';
import { WebsiteSettingsModel } from '@/infrastructure/settings/models/WebsiteSettingsModel';
import { UnifiedLogger } from '@/application/shared/UnifiedLogger';

@injectable()
export class MongooseSocialNetworkRepository
  implements SocialNetworkRepository
{
  constructor(
    @inject('UnifiedLogger') private readonly logger: UnifiedLogger
  ) {}
  async getAllSocialNetworks(): Promise<SocialNetwork[]> {
    const settingsDocument = await WebsiteSettingsModel.findOne({
      key: 'socialNetworks',
    });

    if (
      !settingsDocument ||
      !settingsDocument.socialNetworks ||
      settingsDocument.socialNetworks.length === 0
    ) {
      return [];
    }

    return settingsDocument.socialNetworks.map(
      (socialNetwork: {
        type: SocialNetworkType;
        url: string;
        label: string;
        enabled: boolean;
      }) => this.mapToDomain(socialNetwork)
    );
  }

  async updateSocialNetworks(socialNetworks: SocialNetwork[]): Promise<void> {
    const socialNetworksData = socialNetworks.map((socialNetwork) =>
      this.mapToDatabase(socialNetwork)
    );

    await WebsiteSettingsModel.updateOne(
      { key: 'socialNetworks' },
      {
        $set: { socialNetworks: socialNetworksData },
        $setOnInsert: { key: 'socialNetworks' },
      },
      { upsert: true }
    );
  }

  async getSocialNetworkByType(
    type: SocialNetworkType
  ): Promise<SocialNetwork | null> {
    const settingsDocument = await WebsiteSettingsModel.findOne(
      { key: 'socialNetworks' },
      { socialNetworks: { $elemMatch: { type } } }
    );

    if (
      !settingsDocument ||
      !settingsDocument.socialNetworks ||
      settingsDocument.socialNetworks.length === 0
    ) {
      return null;
    }

    return this.mapToDomain(settingsDocument.socialNetworks[0]);
  }

  private mapToDomain(doc: {
    type: SocialNetworkType;
    url: string;
    label: string;
    enabled: boolean;
  }): SocialNetwork {
    try {
      const typeValueObject = new SocialNetworkTypeValueObject(
        doc.type as SocialNetworkType
      );
      const urlValueObject = SocialNetworkUrl.fromString(
        doc.url,
        doc.type as SocialNetworkType
      );
      const labelValueObject = SocialNetworkLabel.fromString(doc.label);

      return new SocialNetwork(
        typeValueObject,
        urlValueObject,
        labelValueObject,
        doc.enabled
      );
    } catch (error) {
      // Log the error with context for debugging
      this.logger.logError(
        error instanceof Error ? error : new Error(String(error)),
        'Invalid social network data found in database',
        {
          socialNetworkType: doc.type,
          url: doc.url,
          label: doc.label,
          enabled: doc.enabled,
        }
      );

      // Re-throw the error to let the application layer handle it
      throw new Error(
        `Invalid social network data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private mapToDatabase(socialNetwork: SocialNetwork): {
    type: SocialNetworkType;
    url: string;
    label: string;
    enabled: boolean;
  } {
    return {
      type: socialNetwork.type.value,
      url: socialNetwork.url.value,
      label: socialNetwork.label.value,
      enabled: socialNetwork.enabled,
    };
  }
}
