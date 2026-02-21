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
 * Apple-inspired glassmorphism slide-in navigation panel for mobile devices
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
      onEscape: undefined,
    });

    focusTrap.activate();

    return () => {
      focusTrap.deactivate();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const glassStyles = {
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  };

  return (
    <>
      {/* Drawer panel - slides from right */}
      <Box
        position="fixed"
        top={0}
        right={0}
        h="100vh"
        w="280px"
        style={glassStyles}
        bg={{ base: 'rgba(255,255,255,0.82)', _dark: 'rgba(28,28,30,0.88)' }}
        borderLeft="1px solid"
        borderLeftColor={{
          base: 'rgba(0,0,0,0.08)',
          _dark: 'rgba(255,255,255,0.1)',
        }}
        zIndex={1001}
        data-testid="mobile-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        transform={isOpen ? 'translateX(0)' : 'translateX(100%)'}
        transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        <VStack align="stretch" h="full" p={5} gap={4}>
          {/* Header with close button */}
          <HStack justify="flex-end">
            <IconButton
              aria-label="Fermer le menu"
              variant="ghost"
              size="lg"
              minW="44px"
              minH="44px"
              onClick={onClose}
              color="fg.muted"
              borderRadius="full"
              _hover={{
                bg: {
                  base: 'rgba(0,0,0,0.06)',
                  _dark: 'rgba(255,255,255,0.08)',
                },
                color: 'fg',
              }}
              data-testid="mobile-menu-close"
            >
              <FiX size={20} />
            </IconButton>
          </HStack>

          {/* Menu items */}
          <VStack
            as="nav"
            align="stretch"
            gap={1}
            flex={1}
            role="navigation"
            aria-label="Navigation mobile"
            colorPalette={colorPalette}
          >
            {menuItems.length === 0 ? (
              <Text color="fg.muted" fontSize="sm" textAlign="center" py={4}>
                Aucun élément de menu configuré
              </Text>
            ) : (
              menuItems.map((item) => (
                <Box
                  key={item.id}
                  onClick={onClose}
                  py={3}
                  px={4}
                  borderRadius="xl"
                  _hover={{
                    bg: {
                      base: 'rgba(0,0,0,0.05)',
                      _dark: 'rgba(255,255,255,0.07)',
                    },
                  }}
                  cursor="pointer"
                  transition="background 0.15s ease"
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
            borderTopColor={{
              base: 'rgba(0,0,0,0.06)',
              _dark: 'rgba(255,255,255,0.08)',
            }}
          >
            <DarkModeToggle size="md" variant="ghost" />
          </HStack>
        </VStack>
      </Box>

      {/* Backdrop overlay */}
      <Box
        position="fixed"
        inset={0}
        bg="blackAlpha.500"
        style={
          {
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          } as React.CSSProperties
        }
        zIndex={1000}
        onClick={onClose}
        data-testid="mobile-menu-backdrop"
        aria-hidden="true"
        tabIndex={-1}
        _hover={{ cursor: 'pointer' }}
      />
    </>
  );
}
