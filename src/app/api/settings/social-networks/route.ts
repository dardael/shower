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
      return NextResponse.json(
        { success: false, error: 'Invalid social networks data' },
        { status: 400 }
      );
    }

    // Validate each social network
    for (const sn of body.socialNetworks) {
      if (
        !sn.type ||
        typeof sn.url !== 'string' ||
        typeof sn.label !== 'string' ||
        typeof sn.enabled !== 'boolean'
      ) {
        return NextResponse.json(
          { success: false, error: 'Invalid social network format' },
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
