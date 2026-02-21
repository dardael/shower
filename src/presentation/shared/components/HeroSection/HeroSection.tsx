'use client';

import React from 'react';
import { Box } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import './hero-section.css';

interface HeroMediaData {
  type: 'image' | 'video';
  url: string;
}

interface HeroSectionProps {
  heroMedia: HeroMediaData | null;
  heroText: string | null;
  header: React.ReactNode;
}

export function HeroSection({
  heroMedia,
  heroText,
  header,
}: HeroSectionProps): React.ReactElement | null {
  if (!heroMedia) {
    return null;
  }

  const sanitizedHtml = heroText
    ? DOMPurify.sanitize(heroText, {
        ADD_ATTR: ['data-variant', 'target', 'rel', 'class'],
        ADD_TAGS: ['a'],
      })
    : '';

  return (
    <Box className="hero-section" data-testid="hero-section">
      <Box className="hero-section__media">
        {heroMedia.type === 'video' ? (
          <video
            src={heroMedia.url}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroMedia.url}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </Box>

      <Box className="hero-section__overlay" />

      <div className="hero-section__header">{header}</div>

      {sanitizedHtml && (
        <Box
          className="hero-section__content"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      )}
    </Box>
  );
}
