import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import type { GetSocialNetworks } from '@/application/settings/GetSocialNetworks';
import type { UpdateSocialNetworks } from '@/application/settings/UpdateSocialNetworks';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { UnifiedLogger } from '@/application/shared/UnifiedLogger';
import { SocialNetworkValidationService } from '@/domain/settings/services/SocialNetworkValidationService';

export async function GET() {
  const logger = container.resolve<UnifiedLogger>('UnifiedLogger');

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
    logger.logError(
      error instanceof Error ? error : new Error(String(error)),
      'Error fetching social networks'
    );
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social networks' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const logger = container.resolve<UnifiedLogger>('UnifiedLogger');
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

    // Convert JSON to domain objects
    const { SocialNetwork } = await import(
      '@/domain/settings/entities/SocialNetwork'
    );
    const socialNetworkObjects = body.socialNetworks.map(
      (socialNetwork: {
        type: SocialNetworkType;
        url: string;
        label: string;
        enabled: boolean;
      }) => SocialNetwork.fromJSON(socialNetwork)
    );

    await updateSocialNetworks.execute(socialNetworkObjects);

    logger.info('Social networks updated successfully', {
      count: socialNetworkObjects.length,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.logError(
      error instanceof Error ? error : new Error(String(error)),
      'Error updating social networks'
    );
    return NextResponse.json(
      {
        success: false,
        error: `Failed to update social networks: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
