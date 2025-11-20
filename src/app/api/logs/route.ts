import { NextResponse } from 'next/server';
import { withApi } from '@/infrastructure/shared/apiWrapper';

// Health check endpoint for logging API
export const GET = withApi(
  async () => {
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      message: 'Logging endpoint simplified - console logging now active',
    });
  },
  { requireAuth: false }
);
