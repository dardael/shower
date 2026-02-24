'use client';

import React from 'react';
import { PublicPageLoader } from '@/presentation/shared/components/PublicPageLoader';
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
  const { state, data, customLoader } = usePublicPageData('home');
  const { themeColor } = useThemeColor();

  // Show loading indicator while data is being fetched
  if (state.isLoading) {
    return (
      <PublicPageLoader
        isLoading={state.isLoading}
        error={null}
        customLoader={customLoader}
      />
    );
  }

  // Show complete page only when all data is loaded
  if (state.isComplete && data) {
    return (
      <PublicPageLayout
        data={data}
        themeColor={themeColor}
        logo={data.logo}
        heroData={data.heroData}
      />
    );
  }

  // Fallback (should not reach here in normal operation)
  return (
    <PublicPageLoader
      isLoading={true}
      error={null}
      customLoader={customLoader}
    />
  );
}
