import { NextResponse } from 'next/server';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { ClientLogAuthenticationService } from '@/infrastructure/shared/services/ClientLogAuthenticationService';

/**
 * Endpoint to provide client log authentication tokens
 *
 * This endpoint allows authenticated users to obtain time-based tokens
 * for client-side logging. The tokens are short-lived and use HMAC
 * authentication to prevent abuse.
 */
export const GET = withApi(
  async () => {
    try {
      const authService = ClientLogAuthenticationService.getInstance();

      // Generate a new token for the client
      const token = authService.generateClientLogToken();

      // Return token with configuration
      return NextResponse.json({
        token,
        config: authService.getClientConfig(),
        expiresAt: new Date(
          Date.now() + authService.getClientConfig().tokenValidityWindow * 1000
        ).toISOString(),
      });
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Failed to generate token',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  },
  { requireAuth: true } // This endpoint requires authentication
);
