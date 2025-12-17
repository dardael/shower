'use client';

import { useEffect, useRef } from 'react';
import { Box, Text } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import { extractFontsFromHtml } from '@/presentation/shared/utils/extractFontsFromHtml';
import { loadGoogleFont } from '@/presentation/shared/utils/loadGoogleFont';
import '@/presentation/shared/components/PublicPageContent/public-page-content.css';

interface PublicPageContentProps {
  content: string;
}

/**
 * Applies column widths from data-colwidth attributes to table cells
 */
function applyTableColumnWidths(container: HTMLElement): void {
  const tables = container.querySelectorAll('table');

  tables.forEach((table) => {
    // Apply border thickness CSS variable
    const borderThickness = table.getAttribute('data-border-thickness');
    if (borderThickness) {
      table.style.setProperty('--table-border-width', `${borderThickness}px`);
    }

    // Apply column widths from data-colwidth
    const cells = table.querySelectorAll('td, th');
    cells.forEach((cell) => {
      const colwidth = cell.getAttribute('data-colwidth');
      if (colwidth) {
        try {
          // data-colwidth can be a JSON array like "[150]" or a single number
          const widths = JSON.parse(colwidth);
          if (Array.isArray(widths) && widths.length > 0 && widths[0]) {
            (cell as HTMLElement).style.width = `${widths[0]}px`;
          }
        } catch {
          // JSON parse failed - colwidth may be a plain number string (e.g., "150")
          // This is expected for some table formats, so we fall back to parseInt
          const width = parseInt(colwidth, 10);
          if (!isNaN(width) && width > 0) {
            (cell as HTMLElement).style.width = `${width}px`;
          }
        }
      }
    });
  });
}

export default function PublicPageContent({ content }: PublicPageContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (content) {
      const fonts = extractFontsFromHtml(content);
      fonts.forEach((font) => {
        loadGoogleFont(font);
      });
    }
  }, [content]);

  useEffect(() => {
    if (contentRef.current) {
      applyTableColumnWidths(contentRef.current);
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
      'table',
      'thead',
      'tbody',
      'tr',
      'td',
      'th',
      'colgroup',
      'col',
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
      'colspan',
      'rowspan',
      'data-colwidth',
      'data-border-thickness',
      'data-vertical-align',
    ],
    ALLOW_DATA_ATTR: true,
    ADD_TAGS: [],
    ADD_ATTR: [],
  });

  return (
    <Box
      ref={contentRef}
      className="public-page-content"
      overflow="visible"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
