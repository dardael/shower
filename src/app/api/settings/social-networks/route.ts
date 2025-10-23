import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import type { GetSocialNetworks } from '@/application/settings/GetSocialNetworks';
import type { UpdateSocialNetworks } from '@/application/settings/UpdateSocialNetworks';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { Logger } from '@/application/shared/Logger';
import { SocialNetworkValidationService } from '@/domain/settings/services/SocialNetworkValidationService';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkUrl } from '@/domain/settings/value-objects/SocialNetworkUrl';
import type { ISocialNetworkUrlNormalizationService } from '@/domain/settings/services/ISocialNetworkUrlNormalizationService';

export async function GET() {
  const logger = container.resolve<Logger>('Logger');

  try {
    const socialNetworks = await logger.measure(
      'api.get.social-networks',
      async () => {
        const getSocialNetworks =
          container.resolve<GetSocialNetworks>('IGetSocialNetworks');
        return await getSocialNetworks.execute();
      },
      { endpoint: '/api/settings/social-networks', method: 'GET' }
    );

    return NextResponse.json({
      success: true,
      data: socialNetworks.map((socialNetwork) => ({
        type: socialNetwork.type.value,
        url: socialNetwork.url.value,
        label: socialNetwork.label.value,
        enabled: socialNetwork.enabled,
      })),
    });
  } catch (error) {
    logger.logError(error, 'Error fetching social networks');
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social networks' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const logger = container.resolve<Logger>('Logger');
  const validationService = container.resolve<SocialNetworkValidationService>(
    'SocialNetworkValidationService'
  );

  try {
    const body = await request.json();

    logger.info('Processing social networks update request');

    // Validate request body using shared validation service
    const validationResult = validationService.validateSocialNetworksArray(
      body.socialNetworks
    );

    if (!validationResult.isValid) {
      const errorMessage = validationResult.errors
        .map((error) => `${error.field}: ${error.message}`)
        .join(', ');

      return NextResponse.json(
        {
          success: false,
          error: `Validation failed: ${errorMessage}`,
        },
        { status: 400 }
      );
    }

    const updateSocialNetworks = container.resolve<UpdateSocialNetworks>(
      'IUpdateSocialNetworks'
    );
    const normalizationService =
      container.resolve<ISocialNetworkUrlNormalizationService>(
        'ISocialNetworkUrlNormalizationService'
      );

    // Convert JSON to domain objects with normalization
    const socialNetworkObjects = body.socialNetworks.map(
      (socialNetwork: {
        type: SocialNetworkType;
        url: string;
        label: string;
        enabled: boolean;
      }) => {
        // Apply normalization before creating the domain object
        const normalizedUrl = SocialNetworkUrl.fromStringWithNormalization(
          socialNetwork.url,
          socialNetwork.type,
          normalizationService
        );

        return SocialNetwork.create(
          socialNetwork.type,
          normalizedUrl.value,
          socialNetwork.label,
          socialNetwork.enabled
        );
      }
    );

    await updateSocialNetworks.execute(socialNetworkObjects);

    logger.info('Social networks updated successfully', {
      count: socialNetworkObjects.length,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.logError(error, 'Error updating social networks');
    return NextResponse.json(
      {
        success: false,
        error: `Failed to update social networks: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 }
    );
  }
}
