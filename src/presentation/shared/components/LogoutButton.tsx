'use client';

import { Button, HStack } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
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
      variant="outline"
      size="md"
      borderRadius="lg"
      fontWeight="medium"
      borderWidth="2px"
      borderColor="border"
      color="fg"
      _hover={{
        bg: 'colorPalette.subtle',
        borderColor: 'colorPalette.solid',
        color: 'fg',
      }}
      _dark={{
        borderColor: 'border',
        _hover: {
          bg: 'colorPalette.subtle',
          borderColor: 'colorPalette.solid',
        },
      }}
    >
      <HStack gap={2}>
        <FiLogOut size={16} />
        <span>Sign out</span>
      </HStack>
    </Button>
  );
}
