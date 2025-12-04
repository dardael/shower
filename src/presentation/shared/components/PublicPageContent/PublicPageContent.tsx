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
    ],
    ALLOWED_ATTR: [
      'href',
      'src',
      'alt',
      'title',
      'target',
      'rel',
      'class',
      'data-theme-color',
      'data-text-align',
      'style',
    ],
    ALLOW_DATA_ATTR: false,
    ADD_TAGS: [],
    ADD_ATTR: [],
    SAFE_FOR_TEMPLATES: true,
  });

  return (
    <Box
      className="public-page-content"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
