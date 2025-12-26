'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Box, Flex, Text, Image, useBreakpointValue } from '@chakra-ui/react';
import DarkModeToggle from '@/presentation/shared/components/DarkModeToggle';
import { PublicHeaderMenuItem } from './PublicHeaderMenuItem';
import { MobileMenuToggle } from './MobileMenuToggle';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { CartIcon, CartDrawer } from '@/presentation/shared/components/Cart';
import { useHeaderMenuTextColorContext } from '@/presentation/shared/contexts/HeaderMenuTextColorContext';
import type { PublicHeaderMenuProps } from './types';

/**
 * PublicHeaderMenu component
 * Displays configured menu items in a horizontal layout with optional logo
 * On mobile (< 768px): Shows hamburger icon that opens slide-in drawer
 * On desktop (>= 768px): Shows full horizontal menu
 * Uses semantic color tokens for light/dark mode support
 * Uses colorPalette for theme color styling
 */
export function PublicHeaderMenu({
  menuItems,
  logo,
  colorPalette = 'blue',
}: PublicHeaderMenuProps): React.ReactElement {
  const [logoError, setLogoError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { headerMenuTextColor } = useHeaderMenuTextColorContext();

  // Detect mobile viewport (< 768px)
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Auto-close drawer when viewport resizes to desktop
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  const handleOpenMenu = (): void => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = (): void => {
    setIsMenuOpen(false);
  };

  const handleOpenCart = (): void => {
    setIsCartOpen(true);
  };

  const handleCloseCart = (): void => {
    setIsCartOpen(false);
  };

  // Empty menu state - show hamburger on mobile, message on desktop
  if (!menuItems || menuItems.length === 0) {
    return (
      <>
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
                    h={{ base: '64px', md: '80px' }}
                    w="auto"
                    objectFit="contain"
                    cursor="pointer"
                    onError={() => setLogoError(true)}
                  />
                </Link>
              )}
              {!isMobile && (
                <Text color="fg.muted" fontSize="sm">
                  No menu items configured yet
                </Text>
              )}
            </Flex>
            <Flex align="center" gap={2}>
              {!isMobile && <DarkModeToggle size="sm" variant="ghost" />}
              {isMobile && (
                <MobileMenuToggle
                  onClick={handleOpenMenu}
                  colorPalette="blue"
                />
              )}
            </Flex>
          </Flex>
        </Box>

        {/* Mobile drawer for empty state */}
        <MobileMenuDrawer
          isOpen={isMenuOpen}
          onClose={handleCloseMenu}
          menuItems={[]}
          colorPalette="blue"
        />
      </>
    );
  }

  return (
    <>
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
          <Flex align="center" gap={{ base: 2, md: 4 }}>
            {/* Logo - always visible */}
            {logo && !logoError && (
              <Link href="/" aria-label="Go to homepage">
                <Image
                  src={logo.url}
                  alt="Site logo"
                  h={{ base: '64px', md: '80px' }}
                  w="auto"
                  objectFit="contain"
                  flexShrink={0}
                  cursor="pointer"
                  onError={() => setLogoError(true)}
                />
              </Link>
            )}

            {/* Desktop: Horizontal menu items */}
            {!isMobile && (
              <Flex
                as="nav"
                align="center"
                gap={{ base: 2, md: 4 }}
                flexWrap="wrap"
                role="navigation"
                aria-label="Main navigation"
              >
                {menuItems.map((item) => (
                  <PublicHeaderMenuItem
                    key={item.id}
                    text={item.text}
                    url={item.url}
                    textColor={headerMenuTextColor}
                  />
                ))}
              </Flex>
            )}
          </Flex>

          <Flex align="center" gap={2}>
            {/* Cart Icon - visible on all viewports */}
            <CartIcon onClick={handleOpenCart} />

            {/* Desktop: Dark mode toggle in header */}
            {!isMobile && (
              <Box color={headerMenuTextColor}>
                <DarkModeToggle size="sm" variant="ghost" />
              </Box>
            )}

            {/* Mobile: Hamburger menu toggle */}
            {isMobile && (
              <MobileMenuToggle
                onClick={handleOpenMenu}
                colorPalette={colorPalette}
              />
            )}
          </Flex>
        </Flex>
      </Box>

      {/* Mobile drawer */}
      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        menuItems={menuItems}
        colorPalette={colorPalette}
      />

      {/* Cart drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={handleCloseCart} />
    </>
  );
}
