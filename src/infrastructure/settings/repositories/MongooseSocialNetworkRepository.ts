import { SocialNetworkRepository } from '../../../domain/settings/repositories/SocialNetworkRepository';
import { SocialNetwork } from '../../../domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '../../../domain/settings/value-objects/SocialNetworkType';
import { SocialNetworkTypeValueObject } from '../../../domain/settings/value-objects/SocialNetworkType';
import { SocialNetworkUrl } from '../../../domain/settings/value-objects/SocialNetworkUrl';
import { SocialNetworkLabel } from '../../../domain/settings/value-objects/SocialNetworkLabel';
import { WebsiteSettingsModel } from '../models/WebsiteSettingsModel';

export class MongooseSocialNetworkRepository
  implements SocialNetworkRepository
{
  async getAllSocialNetworks(): Promise<SocialNetwork[]> {
    const settingsDoc = await WebsiteSettingsModel.findOne({
      key: 'socialNetworks',
    });

    if (
      !settingsDoc ||
      !settingsDoc.socialNetworks ||
      settingsDoc.socialNetworks.length === 0
    ) {
      return this.getDefaultSocialNetworks();
    }

    return settingsDoc.socialNetworks.map(
      (sn: {
        type: SocialNetworkType;
        url: string;
        label: string;
        enabled: boolean;
      }) => this.mapToDomain(sn)
    );
  }

  async updateSocialNetworks(socialNetworks: SocialNetwork[]): Promise<void> {
    const socialNetworksData = socialNetworks.map((sn) =>
      this.mapToDatabase(sn)
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
    const allNetworks = await this.getAllSocialNetworks();
    return allNetworks.find((sn) => sn.type.value === type) || null;
  }

  private getDefaultSocialNetworks(): SocialNetwork[] {
    return SocialNetwork.createAllDefaults();
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
      // If there's an error mapping, create a default social network
      console.error(`Error mapping social network from database: ${error}`);
      return SocialNetwork.createDefault(doc.type as SocialNetworkType);
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
