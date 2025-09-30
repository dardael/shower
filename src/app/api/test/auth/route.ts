import { NextRequest, NextResponse } from 'next/server';
import { encode } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  // Only allow in test environment - check for test header or test environment variable
  const testHeader = request.headers.get('X-Test-Auth');
  const isTestEnv =
    process.env.NEXTAUTH_TEST_AUTH === 'true' && testHeader === 'true';

  if (!isTestEnv) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  // Get email from request
  const data = await request.json();
  const email = data.email || 'test@example.com';
  const isAdmin = data.isAdmin !== false; // Default to admin for tests

  // Create a test user session
  const user = {
    id: 'test-user-id',
    name: isAdmin ? 'Test Admin' : 'Test User',
    email: email,
    image: 'https://via.placeholder.com/150',
  };

  // Create a session token
  const token = await encode({
    token: {
      name: user.name,
      email: user.email,
      picture: user.image,
      sub: user.id,
    },
    secret: process.env.NEXTAUTH_SECRET || 'test-secret',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  // Set the session cookie
  const cookieValue = `next-auth.session-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`;

  // Return the response with cookie
  return new NextResponse(JSON.stringify({ success: true, user }), {
    status: 200,
    headers: {
      'Set-Cookie': cookieValue,
      'Content-Type': 'application/json',
    },
  });
}
