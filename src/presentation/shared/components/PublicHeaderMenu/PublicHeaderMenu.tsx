'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Box, Flex, Image, useBreakpointValue } from '@chakra-ui/react';
import DarkModeToggle from '@/presentation/shared/components/DarkModeToggle';
import { PublicHeaderMenuItem } from './PublicHeaderMenuItem';
import { MobileMenuToggle } from './MobileMenuToggle';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { CartIcon, CartDrawer } from '@/presentation/shared/components/Cart';
import { useHeaderMenuTextColorContext } from '@/presentation/shared/contexts/HeaderMenuTextColorContext';
import type { PublicHeaderMenuProps } from './types';

/**
 * PublicHeaderMenu component
 * Apple-inspired glassmorphism sticky header
 * On mobile (< 768px): Shows hamburger icon that opens slide-in drawer
 * On desktop (>= 768px): Shows full horizontal menu
 */
export function PublicHeaderMenu({
  menuItems,
  logo,
  colorPalette = 'blue',
  transparent = false,
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

  const glassStyles = transparent
    ? {}
    : {
        backdropFilter: 'blur(24px) saturate(200%)',
        WebkitBackdropFilter: 'blur(24px) saturate(200%)',
      };

  const effectiveTextColor = transparent
    ? 'white'
    : headerMenuTextColor || undefined;

  // Empty menu state
  if (!menuItems || menuItems.length === 0) {
    return (
      <>
        <Box
          as="header"
          data-testid="public-header-menu"
          position="sticky"
          top={0}
          zIndex={100}
          style={glassStyles}
          bg={{ base: 'rgba(255,255,255,0.78)', _dark: 'rgba(22,22,24,0.78)' }}
          borderBottomWidth="1px"
          borderColor={{
            base: 'rgba(0,0,0,0.1)',
            _dark: 'rgba(255,255,255,0.1)',
          }}
          py={{ base: '10px', md: '12px' }}
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
                <Link
                  href="/"
                  aria-label="Aller à l'accueil"
                  style={{ background: 'transparent' }}
                >
                  <Image
                    src={logo.url}
                    alt="Logo du site"
                    h={{ base: '52px', md: '60px' }}
                    w="auto"
                    objectFit="contain"
                    cursor="pointer"
                    bg="transparent"
                    onError={() => setLogoError(true)}
                  />
                </Link>
              )}
            </Flex>
            <Flex align="center" gap={2}>
              {!isMobile && <DarkModeToggle size="sm" variant="ghost" />}
              {isMobile && (
                <MobileMenuToggle
                  onClick={handleOpenMenu}
                  colorPalette={colorPalette}
                />
              )}
            </Flex>
          </Flex>
        </Box>

        <MobileMenuDrawer
          isOpen={isMenuOpen}
          onClose={handleCloseMenu}
          menuItems={[]}
          colorPalette={colorPalette}
        />
      </>
    );
  }

  return (
    <>
      <Box
        as="header"
        data-testid="public-header-menu"
        position={transparent ? 'relative' : 'sticky'}
        top={0}
        zIndex={100}
        style={glassStyles}
        bg={
          transparent
            ? 'transparent'
            : { base: 'rgba(255,255,255,0.78)', _dark: 'rgba(22,22,24,0.78)' }
        }
        borderBottomWidth={transparent ? '0' : '1px'}
        borderColor={
          transparent
            ? undefined
            : {
                base: 'rgba(0,0,0,0.1)',
                _dark: 'rgba(255,255,255,0.1)',
              }
        }
        py={{ base: '10px', md: '12px' }}
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
          {/* Left: Logo */}
          <Flex align="center" flexShrink={0}>
            {logo && !logoError && (
              <Link
                href="/"
                aria-label="Aller à l'accueil"
                style={{ background: 'transparent' }}
              >
                <Image
                  src={logo.url}
                  alt="Logo du site"
                  h={{ base: '52px', md: '60px' }}
                  w="auto"
                  objectFit="contain"
                  cursor="pointer"
                  bg="transparent"
                  onError={() => setLogoError(true)}
                />
              </Link>
            )}
          </Flex>

          {/* Right section: Desktop navigation + Actions */}
          <Flex align="center" gap={{ base: 1, md: 2 }}>
            {/* Desktop navigation */}
            {!isMobile && (
              <Flex
                as="nav"
                align="center"
                gap={{ base: 1, md: 2 }}
                role="navigation"
                aria-label="Navigation principale"
              >
                {menuItems.map((item) => (
                  <PublicHeaderMenuItem
                    key={item.id}
                    text={item.text}
                    url={item.url}
                    textColor={effectiveTextColor}
                  />
                ))}
              </Flex>
            )}

            {/* Actions */}
            <CartIcon onClick={handleOpenCart} />

            {!isMobile && (
              <Box color={effectiveTextColor}>
                <DarkModeToggle size="sm" variant="ghost" />
              </Box>
            )}

            {isMobile && (
              <MobileMenuToggle
                onClick={handleOpenMenu}
                colorPalette={colorPalette}
                transparent={transparent}
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
