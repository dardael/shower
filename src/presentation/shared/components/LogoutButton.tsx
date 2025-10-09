'use client';

import { BetterAuthClientAdapter } from '@/infrastructure/auth/adapters/BetterAuthClientAdapter';
import { useRouter } from 'next/navigation';

const authClient = new BetterAuthClientAdapter();

export default function LogoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    console.log('Sign out button clicked');
    try {
      console.log('Calling signOut...');
      await authClient.signOut();
      console.log('Sign out completed');

      // Redirect to admin page after sign out
      console.log('Redirecting to /admin');
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback: force redirect even if there's an error
      router.push('/admin');
      router.refresh();
    }
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
