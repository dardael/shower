import { inject, injectable } from 'tsyringe';
import { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { SocialNetworkTypeValueObject } from '@/domain/settings/value-objects/SocialNetworkType';
import { SocialNetworkUrl } from '@/domain/settings/value-objects/SocialNetworkUrl';
import { SocialNetworkLabel } from '@/domain/settings/value-objects/SocialNetworkLabel';
import { SocialNetworkModel } from '@/infrastructure/settings/models/SocialNetworkModel';
import { Logger } from '@/application/shared/Logger';

// Ensure model is registered
import '@/infrastructure/settings/models/SocialNetworkModel';

@injectable()
export class MongooseSocialNetworkRepository
  implements SocialNetworkRepository
{
  constructor(@inject('Logger') private readonly logger: Logger) {}

  async getAllSocialNetworks(): Promise<SocialNetwork[]> {
    const socialNetworksDocuments = await SocialNetworkModel.find();

    if (!socialNetworksDocuments || socialNetworksDocuments.length === 0) {
      return [];
    }

    return socialNetworksDocuments.map(
      (socialNetwork: {
        type: SocialNetworkType;
        url: string;
        label: string;
        enabled: boolean;
      }) => this.mapToDomain(socialNetwork)
    );
  }

  async updateSocialNetworks(socialNetworks: SocialNetwork[]): Promise<void> {
    // Clear existing social networks
    await SocialNetworkModel.deleteMany({});

    // Insert new social networks
    if (socialNetworks.length > 0) {
      const socialNetworksData = socialNetworks.map((socialNetwork) =>
        this.mapToDatabase(socialNetwork)
      );
      await SocialNetworkModel.insertMany(socialNetworksData);
    }
  }

  async getSocialNetworkByType(
    type: SocialNetworkType
  ): Promise<SocialNetwork | null> {
    const socialNetworkDocument = await SocialNetworkModel.findOne({ type });

    if (!socialNetworkDocument) {
      return null;
    }

    return this.mapToDomain(socialNetworkDocument);
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
      this.logger.logErrorWithObject(
        error,
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
        `Invalid social network data: ${error instanceof Error ? error.message : String(error)}`
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
