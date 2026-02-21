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
  transparent?: boolean;
}

/**
 * MobileMenuToggle component
 * Hamburger button to open mobile navigation drawer
 * Minimum 44x44px touch target for accessibility
 */
export function MobileMenuToggle({
  onClick,
  colorPalette = 'blue',
  transparent = false,
}: MobileMenuToggleProps): React.ReactElement {
  return (
    <IconButton
      aria-label="Ouvrir le menu"
      variant="ghost"
      size="lg"
      minW="44px"
      minH="44px"
      borderRadius="full"
      onClick={onClick}
      colorPalette={colorPalette}
      color={transparent ? 'white' : { base: 'gray.700', _dark: 'gray.200' }}
      _hover={{
        bg: transparent
          ? 'rgba(255,255,255,0.15)'
          : { base: 'rgba(0,0,0,0.06)', _dark: 'rgba(255,255,255,0.08)' },
      }}
      _active={{
        bg: transparent
          ? 'rgba(255,255,255,0.25)'
          : { base: 'rgba(0,0,0,0.1)', _dark: 'rgba(255,255,255,0.12)' },
      }}
      data-testid="mobile-menu-toggle"
    >
      <FiMenu size={22} />
    </IconButton>
  );
}
