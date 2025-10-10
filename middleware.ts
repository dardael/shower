import { NextResponse } from 'next/server';

export function middleware() {
  // For now, we'll handle authentication at the page level
  // Better Auth middleware can be added later if needed
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/api/auth/:path*'],
};
