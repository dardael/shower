'use client';

import React from 'react';
import { Text } from '@chakra-ui/react';
import type { PublicHeaderMenuItemProps } from './types';

/**
 * PublicHeaderMenuItem component
 * Displays a single non-clickable menu item text
 * Uses semantic color tokens for light/dark mode support
 */
export function PublicHeaderMenuItem({
  text,
}: PublicHeaderMenuItemProps): React.ReactElement {
  return (
    <Text
      fontSize="md"
      fontWeight="medium"
      color="inherit"
      cursor="default"
      px={3}
      py={2}
    >
      {text}
    </Text>
  );
}
