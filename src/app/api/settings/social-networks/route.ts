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
      data: socialNetworks.map((sn) => ({
        type: sn.type.value,
        url: sn.url.value,
        label: sn.label.value,
        enabled: sn.enabled,
      })),
    });
  } catch (error) {
    logger.logError('Error fetching social networks', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
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

    logger.logInfo('Processing social networks update request', {
      socialNetworksCount: body.socialNetworks?.length || 0,
    });

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
    for (const [index, sn] of body.socialNetworks.entries()) {
      const validationErrors: string[] = [];

      // Validate type
      if (!sn.type || typeof sn.type !== 'string') {
        validationErrors.push('type is required and must be a string');
      } else if (
        !Object.values(SocialNetworkType).includes(sn.type as SocialNetworkType)
      ) {
        validationErrors.push(
          `type must be one of: ${Object.values(SocialNetworkType).join(', ')}`
        );
      }

      // Validate URL
      if (typeof sn.url !== 'string') {
        validationErrors.push('url is required and must be a string');
      } else if (sn.url.length > 2048) {
        validationErrors.push('url must be less than 2048 characters');
      }

      // Validate label
      if (typeof sn.label !== 'string') {
        validationErrors.push('label is required and must be a string');
      } else if (sn.label.length === 0) {
        validationErrors.push('label cannot be empty');
      } else if (sn.label.length > 50) {
        validationErrors.push('label must be less than 50 characters');
      } else if (/<|>|&|"|'/.test(sn.label)) {
        validationErrors.push('label contains invalid characters');
      }

      // Validate enabled
      if (typeof sn.enabled !== 'boolean') {
        validationErrors.push('enabled is required and must be a boolean');
      }

      if (validationErrors.length > 0) {
        logger.logWarning(
          `Validation failed for social network at index ${index}`,
          {
            index,
            socialNetwork: sn,
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
      (sn: {
        type: SocialNetworkType;
        url: string;
        label: string;
        enabled: boolean;
      }) => SocialNetwork.fromJSON(sn)
    );

    await updateSocialNetworks.execute(socialNetworkObjects);

    logger.logInfo('Social networks updated successfully', {
      count: socialNetworkObjects.length,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.logError('Error updating social networks', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        error: `Failed to update social networks: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
