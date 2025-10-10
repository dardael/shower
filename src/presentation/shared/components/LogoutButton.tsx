'use client';

import { BetterAuthClientAdapter } from '@/infrastructure/auth/adapters/BetterAuthClientAdapter';
import { useRouter } from 'next/navigation';

const authClient = new BetterAuthClientAdapter();

export default function LogoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
    router.push('/admin');
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
    >
      Sign out
    </button>
  );
}
