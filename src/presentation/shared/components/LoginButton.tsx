'use client';

import { BetterAuthClientAdapter } from '@/infrastructure/auth/adapters/BetterAuthClientAdapter';
import { Button } from '@/presentation/shared/components/ui/button';

const authClient = new BetterAuthClientAdapter();

export default function LoginButton() {
  return (
    <Button
      onClick={() => authClient.signInSocial('google', '/admin')}
      className="w-full"
    >
      Continue with Google
    </Button>
  );
}
