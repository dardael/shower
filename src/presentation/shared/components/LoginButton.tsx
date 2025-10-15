'use client';

import { Button, HStack } from '@chakra-ui/react';
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
      loadingText="Connexion..."
      colorPalette="blue"
      variant="solid"
      size="lg"
      width="full"
      height="56px"
      borderRadius="lg"
      fontSize="md"
      fontWeight="600"
      _hover={{
        transform: 'translateY(-1px)',
        boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.5)',
      }}
      _active={{
        transform: 'translateY(0)',
      }}
      _focusVisible={{
        ring: '2px',
        ringColor: 'blue.500',
        ringOffset: '2px',
      }}
    >
      {!isLoading && (
        <HStack gap={3}>
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </HStack>
      )}
    </Button>
  );
}
