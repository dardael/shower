'use client';

import React from 'react';
import Link from 'next/link';
import { Link as ChakraLink, Text } from '@chakra-ui/react';
import type { PublicHeaderMenuItemProps } from './types';

/**
 * PublicHeaderMenuItem component
 * Displays a single clickable menu item as a Next.js Link
 * Uses semantic color tokens for light/dark mode support
 */
export function PublicHeaderMenuItem({
  text,
  url,
  textColor,
}: PublicHeaderMenuItemProps): React.ReactElement {
  const colorStyle = textColor || 'inherit';

  if (!url) {
    return (
      <Text
        fontSize="md"
        fontWeight="medium"
        color={colorStyle}
        cursor="default"
        px={3}
        py={2}
      >
        {text}
      </Text>
    );
  }

  return (
    <ChakraLink
      asChild
      px={3}
      py={2}
      outline="none"
      boxShadow="none"
      _focus={{ outline: 'none', boxShadow: 'none' }}
      _focusVisible={{ outline: 'none', boxShadow: 'none' }}
      _active={{ outline: 'none', boxShadow: 'none' }}
      css={{
        '&:focus': { outline: 'none' },
        '&:focus-visible': { outline: 'none' },
      }}
    >
      <Link href={url}>
        <Text
          fontSize="md"
          fontWeight="medium"
          color={colorStyle}
          _hover={{ textDecoration: 'underline' }}
        >
          {text}
        </Text>
      </Link>
    </ChakraLink>
  );
}
