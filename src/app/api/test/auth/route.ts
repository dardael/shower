import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import type { ILogger } from '@/application/shared/ILogger';
import { LogMessage } from '@/application/shared/LogMessage';
import { LogLevel } from '@/domain/shared/value-objects/LogLevel';

export async function POST(request: NextRequest) {
  const { email, isAdmin } = await request.json();

  if (request.headers.get('X-Test-Auth') !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // For testing purposes, we'll create a mock session
    // In a real scenario, this would involve Better Auth's session creation
    const mockSession = {
      user: {
        id: 'test-user-id',
        email: email,
        name: isAdmin ? 'Test Admin' : 'Test User',
        image: null,
      },
      session: {
        id: 'test-session-id',
        userId: 'test-user-id',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        token: 'test-session-token',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    // Set a test cookie to simulate authentication
    // Better Auth uses a different cookie format
    const response = NextResponse.json({ success: true, session: mockSession });
    response.cookies.set('better-auth.session_token', 'test-session-token', {
      httpOnly: true,
      secure: false, // for testing
      sameSite: 'lax',
      path: '/',
    });

    // Store test user data in a separate cookie for authorization checks
    response.cookies.set(
      'test-user-data',
      JSON.stringify({
        email: email,
        isAdmin: isAdmin,
      }),
      {
        httpOnly: true,
        secure: false, // for testing
        sameSite: 'lax',
        path: '/',
      }
    );

    return response;
  } catch (error) {
    const logger = container.resolve<ILogger>('ILogger');
    new LogMessage(logger).execute(LogLevel.ERROR, 'Test auth error', {
      error,
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
