'use client';

import React from 'react';
import { HStack, Text, Link } from '@chakra-ui/react';
import { SocialNetworkIcon } from './SocialNetworkIcon';
import type { SocialNetworkItemProps } from './types';

/**
 * SocialNetworkItem component
 * Apple-inspired pill-shaped social network link with glassmorphism hover effect
 */
export function SocialNetworkItem({
  type,
  url,
  label,
}: SocialNetworkItemProps) {
  // Validate URL on client side for security
  const isValidUrl = React.useMemo(() => {
    try {
      const urlObj = new URL(url);
      return ['https:', 'http:', 'mailto:', 'tel:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }, [url]);

  // Don't render if URL is invalid
  if (!isValidUrl) {
    return null;
  }

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={`${label} - ${type} (ouvre dans un nouvel onglet)`}
      textDecoration="none"
      data-testid={`social-network-item-${type}`}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      minH="44px"
      px={{ base: 4, md: 5 }}
      py={2}
      borderRadius="full"
      border="1px solid"
      borderColor={{
        base: 'rgba(0,0,0,0.1)',
        _dark: 'rgba(255,255,255,0.15)',
      }}
      bg={{
        base: 'rgba(255,255,255,0.5)',
        _dark: 'rgba(255,255,255,0.06)',
      }}
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      transition="all 0.2s ease"
      _hover={{
        textDecoration: 'none',
        bg: {
          base: 'rgba(255,255,255,0.85)',
          _dark: 'rgba(255,255,255,0.12)',
        },
        borderColor: {
          base: 'rgba(0,0,0,0.2)',
          _dark: 'rgba(255,255,255,0.25)',
        },
        transform: 'translateY(-1px)',
        boxShadow: {
          base: '0 4px 16px rgba(0,0,0,0.1)',
          _dark: '0 4px 16px rgba(0,0,0,0.4)',
        },
      }}
      _focusVisible={{
        outline: '2px solid',
        outlineColor: 'colorPalette.solid',
        outlineOffset: '2px',
        borderRadius: 'full',
      }}
    >
      <HStack gap={2} align="center">
        <SocialNetworkIcon type={type} size={18} />
        <Text
          fontSize="sm"
          fontWeight="400"
          letterSpacing="0.01em"
          color="fg"
          whiteSpace="nowrap"
        >
          {label}
        </Text>
      </HStack>
    </Link>
  );
}
