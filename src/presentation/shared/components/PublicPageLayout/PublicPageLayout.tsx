'use client';

import React from 'react';
import { Container, Box, Flex } from '@chakra-ui/react';
import PublicPageContent from '@/presentation/shared/components/PublicPageContent/PublicPageContent';
import { PublicHeaderMenu } from '@/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu';
import { SocialNetworksFooter } from '@/presentation/shared/components/SocialNetworksFooter/SocialNetworksFooter';
import { HeroSection } from '@/presentation/shared/components/HeroSection/HeroSection';
import type { PublicPageData, HeroDataDTO } from '@/types/page-load-state';
import type { PublicLogo } from '@/presentation/shared/components/PublicHeaderMenu/types';
import type { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

export interface PublicPageLayoutProps {
  data: PublicPageData;
  themeColor: ThemeColorToken;
  logo?: PublicLogo | null;
  heroData?: HeroDataDTO | null;
}

/**
 * Shared layout component for public pages
 * Renders header, content, and footer with consistent structure
 * When heroData is provided, renders a full-viewport hero section with transparent header
 */
export function PublicPageLayout({
  data,
  themeColor,
  logo,
  heroData,
}: PublicPageLayoutProps): React.ReactElement {
  // Transform menu data to the format expected by PublicHeaderMenu
  const menuItems = data.menuData.map((item) => ({
    id: item.id,
    text: item.text,
    url: item.url,
    position: item.position,
  }));

  // Transform footer data to the format expected by SocialNetworksFooter
  const socialNetworks = data.footerData.socialNetworks || [];

  // PageContent from the API is a DTO with id, menuItemId, and content (string)
  const contentString = data.pageContent.content;

  const hasHero =
    heroData !== null && heroData !== undefined && heroData.media !== null;

  return (
    <Flex direction="column" minH="100vh">
      {hasHero ? (
        <HeroSection
          heroMedia={heroData.media!}
          heroText={heroData.text || ''}
          header={
            <PublicHeaderMenu
              menuItems={menuItems}
              logo={logo}
              colorPalette={themeColor}
              transparent
            />
          }
        />
      ) : (
        <PublicHeaderMenu
          menuItems={menuItems}
          logo={logo}
          colorPalette={themeColor}
        />
      )}
      <Box flex="1" overflow="clip">
        <Container maxW="container.lg" py={8} overflow="visible">
          <PublicPageContent content={contentString} />
        </Container>
      </Box>
      <SocialNetworksFooter socialNetworks={socialNetworks} />
    </Flex>
  );
}
