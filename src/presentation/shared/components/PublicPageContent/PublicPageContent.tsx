'use client';

import { Box, Text } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import '@/presentation/shared/components/PublicPageContent/public-page-content.css';

interface PublicPageContentProps {
  content: string;
}

export default function PublicPageContent({ content }: PublicPageContentProps) {
  if (!content) {
    return (
      <Box textAlign="center" py={12} px={4} bg="bg.subtle" borderRadius="lg">
        <Text color="fg.muted" fontSize="lg">
          This page has no content yet.
        </Text>
      </Box>
    );
  }

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
    ],
    ALLOW_DATA_ATTR: false,
  });

  return (
    <Box
      className="public-page-content"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
