'use client';

import React, { useEffect } from 'react';
import { Box, VStack, HStack, IconButton, Text } from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';
import { PublicHeaderMenuItem } from './PublicHeaderMenuItem';
import DarkModeToggle from '@/presentation/shared/components/DarkModeToggle';
import { FocusTrap } from '@/presentation/shared/utils/focusTrap';
import type { PublicMenuItem } from './types';
import type { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

/**
 * Props for MobileMenuDrawer component
 */
export interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: PublicMenuItem[];
  colorPalette?: ThemeColorToken;
}

/**
 * MobileMenuDrawer component
 * Slide-in navigation panel for mobile devices
 * Slides from right, 280px width, with backdrop overlay
 */
export function MobileMenuDrawer({
  isOpen,
  onClose,
  menuItems,
  colorPalette = 'blue',
}: MobileMenuDrawerProps): React.ReactElement | null {
  // Handle Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus trap for accessibility
  useEffect(() => {
    if (!isOpen) return;

    const focusTrap = new FocusTrap({
      containerSelector: '[data-testid="mobile-menu-drawer"]',
      onEscape: undefined, // Escape is handled by the separate effect above
    });

    focusTrap.activate();

    return () => {
      focusTrap.deactivate();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Drawer panel - slides from right */}
      <Box
        position="fixed"
        top={0}
        right={0}
        h="100vh"
        w="280px"
        bg="bg.subtle"
        borderLeft="1px solid"
        borderLeftColor="border"
        style={{ zIndex: 1001 }}
        data-testid="mobile-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        transform={isOpen ? 'translateX(0)' : 'translateX(100%)'}
        transition="transform 0.3s ease-in-out"
      >
        <VStack align="stretch" h="full" p={4} gap={4}>
          {/* Header with close button */}
          <HStack justify="flex-end">
            <IconButton
              aria-label="Close menu"
              variant="ghost"
              size="lg"
              minW="44px"
              minH="44px"
              onClick={onClose}
              color="fg.muted"
              _hover={{ bg: 'bg.muted', color: 'fg' }}
              data-testid="mobile-menu-close"
            >
              <FiX size={24} />
            </IconButton>
          </HStack>

          {/* Menu items */}
          <VStack
            as="nav"
            align="stretch"
            gap={2}
            flex={1}
            role="navigation"
            aria-label="Mobile navigation"
            colorPalette={colorPalette}
          >
            {menuItems.length === 0 ? (
              <Text color="fg.muted" fontSize="sm" textAlign="center" py={4}>
                No menu items configured
              </Text>
            ) : (
              menuItems.map((item) => (
                <Box
                  key={item.id}
                  onClick={onClose}
                  py={2}
                  px={3}
                  borderRadius="md"
                  _hover={{ bg: 'bg.muted' }}
                  cursor="pointer"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  <PublicHeaderMenuItem text={item.text} url={item.url} />
                </Box>
              ))
            )}
          </VStack>

          {/* Dark mode toggle at bottom */}
          <HStack
            justify="center"
            py={4}
            borderTop="1px solid"
            borderTopColor="border"
          >
            <DarkModeToggle size="md" variant="ghost" />
          </HStack>
        </VStack>
      </Box>

      {/* Backdrop overlay */}
      <Box
        position="fixed"
        inset={0}
        bg="blackAlpha.600"
        style={{ zIndex: 1000 }}
        onClick={onClose}
        data-testid="mobile-menu-backdrop"
        aria-hidden="true"
        tabIndex={-1}
        _hover={{ cursor: 'pointer' }}
      />
    </>
  );
}
