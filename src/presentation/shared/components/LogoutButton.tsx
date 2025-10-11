'use client';

import { Button } from '@chakra-ui/react';
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
    <Button
      onClick={handleSignOut}
      colorPalette="red"
      px={4}
      py={2}
      _dark={{
        bg: 'red.600',
        _hover: { bg: 'red.500' },
      }}
    >
      Sign out
    </Button>
  );
}
