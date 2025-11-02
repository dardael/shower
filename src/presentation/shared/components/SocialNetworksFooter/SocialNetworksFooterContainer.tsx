'use client';

import React from 'react';

import { usePathname } from 'next/navigation';
import { SocialNetworksFooter } from './SocialNetworksFooter';
import { useSocialNetworksFooter } from './useSocialNetworksFooter';
import type { SocialNetworksFooterProps } from './types';

/**
 * SocialNetworksFooterContainer component
 * Handles data fetching and state management for social networks footer
 * Optimized for conditional rendering based on route
 * Renders loading states and error handling
 */
export function SocialNetworksFooterContainer(
  props: Omit<SocialNetworksFooterProps, 'socialNetworks'>
) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // Always call hook to satisfy React rules of hooks
  const { socialNetworks, isLoading, error } = useSocialNetworksFooter();

  // Early return for admin routes - don't render anything
  if (isAdmin) {
    return null;
  }

  // Don't render anything while loading or if there's an error
  if (isLoading) {
    return (
      <SocialNetworksFooter
        socialNetworks={socialNetworks ?? undefined}
        {...props}
      />
    );
  }

  // Don't render on error - footer is not critical functionality
  if (error) {
    return null;
  }

  return (
    <SocialNetworksFooter
      socialNetworks={socialNetworks ?? undefined}
      {...props}
    />
  );
}
