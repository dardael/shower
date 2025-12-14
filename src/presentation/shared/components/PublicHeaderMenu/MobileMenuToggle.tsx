'use client';

import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import type { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

/**
 * Props for MobileMenuToggle component
 */
export interface MobileMenuToggleProps {
  onClick: () => void;
  colorPalette?: ThemeColorToken;
}

/**
 * MobileMenuToggle component
 * Hamburger button to open mobile navigation drawer
 * Minimum 44x44px touch target for accessibility
 */
export function MobileMenuToggle({
  onClick,
  colorPalette = 'blue',
}: MobileMenuToggleProps): React.ReactElement {
  return (
    <IconButton
      aria-label="Open menu"
      variant="ghost"
      size="lg"
      minW="44px"
      minH="44px"
      onClick={onClick}
      colorPalette={colorPalette}
      color={{ base: 'black', _dark: 'white' }}
      _hover={{ bg: 'colorPalette.muted' }}
      _active={{ bg: 'colorPalette.muted' }}
      data-testid="mobile-menu-toggle"
    >
      <FiMenu size={24} />
    </IconButton>
  );
}
