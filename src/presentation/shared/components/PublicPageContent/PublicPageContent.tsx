'use client';

import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import { extractFontsFromHtml } from '@/presentation/shared/utils/extractFontsFromHtml';
import { loadGoogleFont } from '@/presentation/shared/utils/loadGoogleFont';
import '@/presentation/shared/components/PublicPageContent/public-page-content.css';

interface PublicPageContentProps {
  content: string;
}

export default function PublicPageContent({ content }: PublicPageContentProps) {
  useEffect(() => {
    if (content) {
      const fonts = extractFontsFromHtml(content);
      fonts.forEach((font) => {
        loadGoogleFont(font);
      });
    }
  }, [content]);

  if (!content) {
    return (
      <Box textAlign="center" py={12} px={4} bg="bg.subtle" borderRadius="lg">
        <Text color="fg.muted" fontSize="lg">
          This page has no content yet.
        </Text>
      </Box>
    );
  }

  // Configure DOMPurify to preserve font-family and color in style attributes
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'blockquote',
      'code',
      'pre',
      'span',
      'div',
    ],
    ALLOWED_ATTR: [
      'href',
      'src',
      'alt',
      'title',
      'target',
      'rel',
      'class',
      'style',
      'data-full-width',
      'data-full-bleed',
      'data-overlay-text',
      'data-overlay-color',
      'data-overlay-font-family',
      'data-overlay-font-size',
      'data-overlay-position',
      'data-overlay-align',
      'data-overlay-bg-color',
      'data-overlay-bg-opacity',
    ],
    ALLOW_DATA_ATTR: true,
    ADD_TAGS: [],
    ADD_ATTR: [],
  });

  return (
    <Box
      className="public-page-content"
      overflow="visible"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
