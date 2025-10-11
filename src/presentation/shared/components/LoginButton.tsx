'use client';

import { Button } from '@chakra-ui/react';
import { BetterAuthClientAdapter } from '@/infrastructure/auth/adapters/BetterAuthClientAdapter';

const authClient = new BetterAuthClientAdapter();

export default function LoginButton() {
  return (
    <Button
      onClick={() => authClient.signInSocial('google', '/admin')}
      colorPalette="blue"
      px={4}
      py={2}
      variant="outline"
      w="full"
      _dark={{
        borderColor: 'blue.400',
        _hover: { bg: 'blue.900' },
      }}
    >
      Continue with Google
    </Button>
  );
}
