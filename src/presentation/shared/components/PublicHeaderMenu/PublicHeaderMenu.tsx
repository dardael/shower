'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import DarkModeToggle from '@/presentation/shared/components/DarkModeToggle';
import { PublicHeaderMenuItem } from './PublicHeaderMenuItem';
import type { PublicHeaderMenuProps } from './types';

/**
 * PublicHeaderMenu component
 * Displays configured menu items in a horizontal layout with optional logo
 * Uses semantic color tokens for light/dark mode support
 * Uses colorPalette for theme color styling
 */
export function PublicHeaderMenu({
  menuItems,
  logo,
  colorPalette = 'blue',
}: PublicHeaderMenuProps): React.ReactElement {
  const [logoError, setLogoError] = useState(false);

  if (!menuItems || menuItems.length === 0) {
    return (
      <Box
        as="header"
        data-testid="public-header-menu"
        bg="bg.subtle"
        borderBottomWidth="1px"
        borderColor="border"
        py={{ base: 3, md: 4 }}
        px={{ base: 4, md: 8 }}
        width="full"
        role="banner"
        aria-label="Site header"
      >
        <Flex
          justify="space-between"
          align="center"
          maxW="container.xl"
          mx="auto"
        >
          <Flex align="center" gap={{ base: 2, md: 4 }}>
            {logo && !logoError && (
              <Link href="/" aria-label="Go to homepage">
                <Image
                  src={logo.url}
                  alt="Site logo"
                  h={{ base: '32px', md: '40px' }}
                  w="auto"
                  objectFit="contain"
                  cursor="pointer"
                  onError={() => setLogoError(true)}
                />
              </Link>
            )}
            <Text color="fg.muted" fontSize="sm">
              No menu items configured yet
            </Text>
          </Flex>
          <Box>
            <DarkModeToggle size="sm" variant="ghost" />
          </Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box
      as="header"
      data-testid="public-header-menu"
      colorPalette={colorPalette}
      bg="colorPalette.solid"
      borderBottomWidth="1px"
      borderColor="colorPalette.emphasized"
      py={{ base: 3, md: 4 }}
      px={{ base: 4, md: 8 }}
      width="full"
      role="banner"
      aria-label="Site header"
    >
      <Flex
        justify="space-between"
        align="center"
        maxW="container.xl"
        mx="auto"
      >
        <Flex
          as="nav"
          align="center"
          gap={{ base: 2, md: 4 }}
          flexWrap="wrap"
          role="navigation"
          aria-label="Main navigation"
        >
          {logo && !logoError && (
            <Link href="/" aria-label="Go to homepage">
              <Image
                src={logo.url}
                alt="Site logo"
                h={{ base: '32px', md: '40px' }}
                w="auto"
                objectFit="contain"
                flexShrink={0}
                cursor="pointer"
                onError={() => setLogoError(true)}
              />
            </Link>
          )}
          {menuItems.map((item) => (
            <Box key={item.id} color={{ base: 'black', _dark: 'white' }}>
              <PublicHeaderMenuItem text={item.text} url={item.url} />
            </Box>
          ))}
        </Flex>
        <Box color={{ base: 'black', _dark: 'white' }}>
          <DarkModeToggle size="sm" variant="ghost" />
        </Box>
      </Flex>
    </Box>
  );
}
