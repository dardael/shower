import { NextResponse } from 'next/server';
import { SettingsServiceLocator } from '@/infrastructure/container';
import { withApi } from '@/infrastructure/shared/apiWrapper';

export const GET = withApi(async () => {
  try {
    // Get website name through application layer
    const getWebsiteName = SettingsServiceLocator.getWebsiteName();
    const name = await getWebsiteName.execute();
    return NextResponse.json({ name });
  } catch {
    return NextResponse.json({ name: 'Shower' }, { status: 200 }); // Return default on error
  }
});
