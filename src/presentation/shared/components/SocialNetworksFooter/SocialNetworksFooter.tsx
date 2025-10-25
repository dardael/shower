'use client';

import React from 'react';
import { Box, Heading, SimpleGrid, VStack, Text } from '@chakra-ui/react';
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
  maxColumns = { base: 2, md: 4, lg: 6 },
  spacing = 6,
  showTitle = true,
  maxItems,
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
        {showTitle && (
          <>
            <Heading as="h2" size="md" color="fg" textAlign="center" mb={2}>
              {title}
            </Heading>

            <Text color="fg.muted" textAlign="center" fontSize="sm" mb={4}>
              Connect with us on your favorite platforms
            </Text>
          </>
        )}

        <SimpleGrid
          columns={maxColumns}
          gap={spacing}
          width="full"
          justifyItems="center"
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
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
