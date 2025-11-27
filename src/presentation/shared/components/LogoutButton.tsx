'use client';

import { useState } from 'react';
import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { BetterAuthClientAdapter } from '@/infrastructure/auth/adapters/BetterAuthClientAdapter';
import { useRouter } from 'next/navigation';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import { useColorMode } from '@/presentation/shared/components/ui/color-mode';

const authClient = new BetterAuthClientAdapter();

export default function LogoutButton() {
  const router = useRouter();
  const logger = useLogger();
  const { colorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(false);

  const isDark = colorMode === 'dark';

  const handleSignOut = async () => {
    setIsLoading(true);

    try {
      await authClient.signOut();
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout failed, clearing local session', error);
    } finally {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={handleSignOut}
        aria-label="Sign out"
        title="Sign out"
        variant="ghost"
        size="sm"
        boxSize="8"
        loading={isLoading}
        disabled={isLoading}
        _hover={{
          bg: 'bg.muted',
          borderColor: 'border.emphasized',
        }}
        _focusVisible={{
          ring: '2px',
          ringColor: 'border.emphasized',
          ringOffset: '2px',
        }}
      >
        <FiLogOut color={isDark ? 'white' : 'black'} />
      </IconButton>
    </ClientOnly>
  );
}
