'use client';

import React from 'react';
import { Container, VStack, Heading, Text } from '@chakra-ui/react';
import { PublicPageLoader } from '@/presentation/shared/components/PublicPageLoader';
import { PublicHeaderMenu } from '@/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu';
import { SocialNetworksFooter } from '@/presentation/shared/components/SocialNetworksFooter/SocialNetworksFooter';
import { PublicPageLayout } from '@/presentation/shared/components/PublicPageLayout/PublicPageLayout';
import { usePublicPageData } from '@/presentation/shared/hooks/usePublicPageData';
import { useThemeColor } from '@/presentation/shared/hooks/useThemeColor';

/**
 * Client-side home page component with loading state
 * Coordinates fetching of menu, footer, and first page content
 * Displays loading indicator until all data is loaded
 * Special case: loads first menu item's content instead of slug-based lookup
 */
export function HomePageClient(): React.ReactElement {
  // Use special 'home' slug to signal home page loading
  const { state, data, retry } = usePublicPageData('home');
  const { themeColor } = useThemeColor();

  // Show loading indicator while data is being fetched
  if (state.isLoading) {
    return (
      <PublicPageLoader
        isLoading={state.isLoading}
        error={state.error}
        onRetry={retry}
      />
    );
  }

  // Handle error state - if no menu items, show friendly message
  if (state.error) {
    // Check if error is due to no menu items
    const isNoMenuItems =
      state.error.failedSources.includes('menu') ||
      state.error.failedSources.includes('content');

    if (isNoMenuItems) {
      return (
        <>
          <PublicHeaderMenu
            menuItems={[]}
            logo={undefined}
            colorPalette={themeColor}
          />
          <Container maxW="container.lg" py={8}>
            <VStack gap={4} textAlign="center">
              <Heading as="h2" size="lg">
                No Content Available
              </Heading>
              <Text fontSize="md">
                Please add your first menu item to get started.
              </Text>
            </VStack>
          </Container>
          <SocialNetworksFooter socialNetworks={[]} />
        </>
      );
    }

    // Other errors - show error with retry
    return (
      <PublicPageLoader isLoading={false} error={state.error} onRetry={retry} />
    );
  }

  // Show complete page only when all data is loaded
  if (state.isComplete && data) {
    return (
      <PublicPageLayout data={data} themeColor={themeColor} logo={data.logo} />
    );
  }

  // Fallback (should not reach here in normal operation)
  return <PublicPageLoader isLoading={true} error={null} />;
}
