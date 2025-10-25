'use client';

import React from 'react';
import { Box, VStack, Heading, Text } from '@chakra-ui/react';
import { SocialNetworkItem } from './SocialNetworkItem';
import type { SocialNetworksFooterProps } from './types';

/**
 * SocialNetworksFooter component
 * Displays configured social networks in a responsive grid layout
 * Only renders when social networks are configured
 */
export function SocialNetworksFooter({
  socialNetworks,
  title = 'Follow Us',
  spacing = 6,
  maxItems,
  showTitle = false,
}: SocialNetworksFooterProps) {
  // Don't render if no social networks are configured
  if (!socialNetworks || socialNetworks.length === 0) {
    return null;
  }

  // Limit items if maxItems is specified
  const displayNetworks = maxItems
    ? socialNetworks.slice(0, maxItems)
    : socialNetworks;

  return (
    <Box
      as="footer"
      bg="bg.subtle"
      borderTopWidth="1px"
      borderColor="border"
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 8 }}
      width="full"
      role="contentinfo"
      aria-label="Social networks footer"
    >
      <VStack gap={spacing} maxW="container.xl" mx="auto">
        {(showTitle || title !== 'Follow Us') && (
          <VStack gap={2} textAlign="center">
            <Heading size="lg" color="fg">
              {title}
            </Heading>
            <Text color="fg.muted" fontSize="md">
              Connect with us on your favorite platforms
            </Text>
          </VStack>
        )}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={spacing}
          flexWrap="wrap"
          maxW="container.lg"
          mx="auto"
          width="full"
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
      </VStack>
    </Box>
  );
}
