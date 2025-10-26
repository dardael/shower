'use client';

import { Button, HStack, Box } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { BetterAuthClientAdapter } from '@/infrastructure/auth/adapters/BetterAuthClientAdapter';

const authClient = new BetterAuthClientAdapter();

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signInSocial('google', '/admin');
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      loading={isLoading}
      loadingText="Connecting..."
      variant="surface"
      size="lg"
      width="full"
      height="52px"
      borderRadius="xl"
      fontSize="md"
      fontWeight="semibold"
      bg="bg.canvas"
      borderWidth="2px"
      borderColor="border"
      color="fg"
      _hover={{
        bg: 'colorPalette.subtle',
        borderColor: 'colorPalette.solid',
        transform: 'translateY(-1px)',
        color: 'fg',
      }}
      _active={{
        transform: 'translateY(0)',
      }}
      _focusVisible={{
        ring: '2px',
        ringColor: 'colorPalette.solid',
        ringOffset: '2px',
      }}
    >
      {!isLoading && (
        <HStack gap={3}>
          <Box p={1} borderRadius="md" bg="white">
            <FcGoogle size={18} />
          </Box>
          <span>Continue with Google</span>
        </HStack>
      )}
    </Button>
  );
}
