import { NextResponse } from 'next/server';
import { SettingsServiceLocator } from '@/infrastructure/container';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';

export async function GET() {
  try {
    // Connect to database
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();

    // Get website name through application layer
    const getWebsiteName = SettingsServiceLocator.getWebsiteName();
    const name = await getWebsiteName.execute();
    return NextResponse.json({ name });
  } catch {
    return NextResponse.json({ name: 'Shower' }, { status: 200 }); // Return default on error
  }
}
