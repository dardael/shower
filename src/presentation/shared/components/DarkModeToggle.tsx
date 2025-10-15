'use client';

import { IconButton } from '@chakra-ui/react';
import { useColorMode } from '@/presentation/shared/components/ui/color-mode';

/**
 * Dark Mode Toggle Component
 *
 * This component provides a toggle button for switching between light and dark modes.
 * It uses Chakra UI's built-in color mode system which automatically syncs with system preferences.
 */
export default function DarkModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle color mode"
      onClick={toggleColorMode}
      variant="ghost"
      size="md"
      borderRadius="lg"
      bg="bg.subtle"
      borderWidth="1px"
      borderColor="border"
      _hover={{
        bg: 'bg.muted',
        borderColor: 'border.emphasized',
      }}
      _dark={{
        bg: 'bg.subtle',
        borderColor: 'border',
        _hover: {
          bg: 'bg.muted',
          borderColor: 'border.emphasized',
        },
      }}
    >
      {colorMode === 'light' ? (
        <span style={{ fontSize: '18px' }}>🌙</span>
      ) : (
        <span style={{ fontSize: '18px' }}>☀️</span>
      )}
    </IconButton>
  );
}
