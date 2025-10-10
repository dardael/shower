'use client';

import { BetterAuthClientAdapter } from '@/infrastructure/auth/adapters/BetterAuthClientAdapter';

const authClient = new BetterAuthClientAdapter();

export default function LoginButton() {
  return (
    <button
      onClick={() => authClient.signInSocial('google', '/admin')}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      Continue with Google
    </button>
  );
}
