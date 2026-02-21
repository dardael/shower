'use client';

import React from 'react';
import { Box, VStack, Heading, Text } from '@chakra-ui/react';
import { SocialNetworkItem } from './SocialNetworkItem';
import type { SocialNetworksFooterProps } from './types';

/**
 * SocialNetworksFooter component
 * Apple-inspired glassmorphism footer
 * Displays configured social networks in a responsive layout
 */
export function SocialNetworksFooter({
  socialNetworks,
  title = 'Suivez-nous',
  maxItems,
  showTitle = false,
}: SocialNetworksFooterProps) {
  const glassStyles = {
    backdropFilter: 'blur(24px) saturate(200%)',
    WebkitBackdropFilter: 'blur(24px) saturate(200%)',
  };

  const footerBoxProps = {
    as: 'footer' as const,
    'data-testid': 'social-networks-footer',
    style: glassStyles,
    bg: { base: 'rgba(255,255,255,0.78)', _dark: 'rgba(22,22,24,0.78)' },
    borderTopWidth: '1px',
    borderColor: {
      base: 'rgba(0,0,0,0.1)',
      _dark: 'rgba(255,255,255,0.1)',
    },
    py: { base: 5, md: 8 },
    px: { base: 4, md: 8 },
    width: 'full',
    role: 'contentinfo',
    'aria-label': 'Pied de page',
  };

  // Always render footer element, but show minimal content when no social networks
  if (!socialNetworks || socialNetworks.length === 0) {
    return (
      <Box {...footerBoxProps}>
        <VStack gap={2} maxW="container.xl" mx="auto" textAlign="center">
          <Text color="fg.muted" fontSize="xs" letterSpacing="wide">
            Aucun réseau social configuré
          </Text>
        </VStack>
      </Box>
    );
  }

  // Limit items if maxItems is specified
  const displayNetworks = maxItems
    ? socialNetworks.slice(0, maxItems)
    : socialNetworks;

  return (
    <Box {...footerBoxProps}>
      <VStack gap={4} maxW="container.xl" mx="auto">
        {(showTitle || title !== 'Suivez-nous') && (
          <Heading
            size="sm"
            color="fg.muted"
            fontWeight="400"
            letterSpacing="wider"
            textTransform="uppercase"
            fontSize="xs"
            textAlign="center"
          >
            {title}
          </Heading>
        )}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={{ base: 3, md: 4 }}
          maxW="container.lg"
          mx="auto"
          width="full"
          flexWrap="wrap"
        >
          {displayNetworks.map((socialNetwork) => (
            <SocialNetworkItem
              key={socialNetwork.type}
              type={socialNetwork.type}
              url={socialNetwork.url}
              label={socialNetwork.label}
              icon={socialNetwork.icon}
            />
          ))}
        </Box>
        <Text
          fontSize="xs"
          color="fg.subtle"
          textAlign="center"
          letterSpacing="wide"
          fontWeight="300"
        >
          &copy; {new Date().getFullYear()}
        </Text>
      </VStack>
    </Box>
  );
}
