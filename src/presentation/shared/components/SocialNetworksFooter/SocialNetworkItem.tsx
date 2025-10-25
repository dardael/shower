'use client';

import React from 'react';
import { VStack, Text, Link } from '@chakra-ui/react';
import { SocialNetworkIcon } from './SocialNetworkIcon';
import type { SocialNetworkItemProps } from './types';

/**
 * SocialNetworkItem component
 * Displays individual social network with icon and label
 * Handles secure external link opening
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

  // Handle click with security validation
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!isValidUrl) {
        e.preventDefault();
        console.warn(`Blocked navigation to unsafe URL: ${url}`);
        return;
      }

      // Let default link behavior handle opening in new tab
      // The Link component with isExternal handles this securely
    },
    [url, isValidUrl]
  );

  // Don't render if URL is invalid
  if (!isValidUrl) {
    return null;
  }

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={`${label} ${type} link (opens in new tab)`}
      textDecoration="none"
      _hover={{ textDecoration: 'none' }}
      onClick={handleClick}
      data-testid={`social-network-item-${type}`}
    >
      <VStack
        gap={2}
        p={4}
        bg="bg.canvas"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border"
        minW={{ base: '80px', md: '100px' }}
        textAlign="center"
        transition="none" // Explicitly disable transitions per project constraints
        _hover={{
          bg: 'bg.muted',
          borderColor: 'border.emphasized',
        }}
        _focusVisible={{
          ring: '2px',
          ringColor: 'colorPalette.solid',
          ringOffset: '2px',
        }}
      >
        <SocialNetworkIcon type={type} size={6} />
        <Text fontSize="sm" fontWeight="medium" color="fg" truncate maxW="full">
          {label}
        </Text>
      </VStack>
    </Link>
  );
}
