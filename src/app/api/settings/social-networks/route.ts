import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import type { GetSocialNetworks } from '@/application/settings/GetSocialNetworks';
import type { UpdateSocialNetworks } from '@/application/settings/UpdateSocialNetworks';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';

export async function GET() {
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
    console.error('Error fetching social networks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social networks' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log(
      'Received social networks update request at:',
      new Date().toISOString()
    );
    const body = await request.json();

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating social networks:', error);
    console.error(
      'Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
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
