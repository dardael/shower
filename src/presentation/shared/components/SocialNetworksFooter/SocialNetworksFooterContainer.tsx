'use client';

import React from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import { SocialNetworksFooter } from './SocialNetworksFooter';
import { useSocialNetworksFooter } from './useSocialNetworksFooter';
import type { SocialNetworksFooterProps } from './types';

/**
 * SocialNetworksFooterContainer component
 * Handles data fetching and state management for the social networks footer
 * Renders loading states and error handling
 */
export function SocialNetworksFooterContainer(
  props: Omit<SocialNetworksFooterProps, 'socialNetworks'>
) {
  const { socialNetworks, isLoading, error } = useSocialNetworksFooter();

  // Don't render anything while loading or if there's an error
  if (isLoading) {
    return (
      <Box
        as="footer"
        bg="bg.subtle"
        borderTopWidth="1px"
        borderColor="border"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, md: 8 }}
        width="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="md" color="colorPalette.solid" />
      </Box>
    );
  }

  // Don't render on error - the footer is not critical functionality
  if (error) {
    return null;
  }

  return (
    <SocialNetworksFooter
      socialNetworks={socialNetworks || undefined}
      {...props}
    />
  );
}
