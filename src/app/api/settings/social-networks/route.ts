import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import type { GetSocialNetworks } from '@/application/settings/GetSocialNetworks';
import type { UpdateSocialNetworks } from '@/application/settings/UpdateSocialNetworks';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import type { ILogger } from '@/application/shared/ILogger';

export async function GET() {
  const logger = container.resolve<ILogger>('ILogger');

  try {
    const getSocialNetworks =
      container.resolve<GetSocialNetworks>('IGetSocialNetworks');
    const socialNetworks = await getSocialNetworks.execute();

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
    logger.logError('Error fetching social networks', { error });
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social networks' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const logger = container.resolve<ILogger>('ILogger');

  try {
    const body = await request.json();

    logger.logInfo('Processing social networks update request');

    // Validate request body
    if (!Array.isArray(body.socialNetworks)) {
      logger.logWarning(
        'Invalid request body - socialNetworks is not an array',
        {
          body: typeof body,
          socialNetworks: body.socialNetworks,
        }
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid social networks data: expected an array',
        },
        { status: 400 }
      );
    }

    // Enhanced validation for each social network
    for (const [index, socialNetwork] of body.socialNetworks.entries()) {
      const validationErrors: string[] = [];

      // Validate type
      if (!socialNetwork.type || typeof socialNetwork.type !== 'string') {
        validationErrors.push('type is required and must be a string');
      } else if (
        !Object.values(SocialNetworkType).includes(
          socialNetwork.type as SocialNetworkType
        )
      ) {
        validationErrors.push(
          `type must be one of: ${Object.values(SocialNetworkType).join(', ')}`
        );
      }

      // Validate URL
      if (typeof socialNetwork.url !== 'string') {
        validationErrors.push('url is required and must be a string');
      } else if (socialNetwork.url.length > 2048) {
        validationErrors.push('url must be less than 2048 characters');
      }

      // Validate label
      if (typeof socialNetwork.label !== 'string') {
        validationErrors.push('label is required and must be a string');
      } else if (socialNetwork.label.length === 0) {
        validationErrors.push('label cannot be empty');
      } else if (socialNetwork.label.length > 50) {
        validationErrors.push('label must be less than 50 characters');
      } else if (/<|>|&|"|'/.test(socialNetwork.label)) {
        validationErrors.push('label contains invalid characters');
      }

      // Validate enabled
      if (typeof socialNetwork.enabled !== 'boolean') {
        validationErrors.push('enabled is required and must be a boolean');
      }

      if (validationErrors.length > 0) {
        logger.logWarning(
          `Validation failed for social network at index ${index}`,
          {
            index,
            socialNetwork: socialNetwork,
            errors: validationErrors,
          }
        );
        return NextResponse.json(
          {
            success: false,
            error: `Invalid social network format at index ${index}: ${validationErrors.join(', ')}`,
          },
          { status: 400 }
        );
      }
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

    logger.logInfo('Social networks updated successfully', {
      count: socialNetworkObjects.length,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.logError('Error updating social networks', { error });
    return NextResponse.json(
      {
        success: false,
        error: `Failed to update social networks: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
