import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { SettingsServiceLocator } from '@/infrastructure/container';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import { authOptions } from '@/infrastructure/auth/api/NextAuthHandler';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Connect to database
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();

    // Parse request body
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Invalid name provided' },
        { status: 400 }
      );
    }

    // Execute use case
    const updateWebsiteName = SettingsServiceLocator.getUpdateWebsiteName();
    await updateWebsiteName.execute({ name });
    return NextResponse.json({ message: 'Website name updated successfully' });
  } catch (error) {
    console.error('Error updating website name:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
