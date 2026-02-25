'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Box, Text } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import { extractFontsFromHtml } from '@/presentation/shared/utils/extractFontsFromHtml';
import { loadGoogleFont } from '@/presentation/shared/utils/loadGoogleFont';
import { ProductListRenderer } from './ProductListRenderer';
import { AppointmentBookingRenderer } from './AppointmentBookingRenderer';
import '@/presentation/shared/components/PublicPageContent/public-page-content.css';

interface PublicPageContentProps {
  content: string;
}

interface ContentSegment {
  type: 'html' | 'productList' | 'appointmentBooking';
  content?: string;
  config?: {
    categoryIds: string[] | null;
    layout: 'grid' | 'list';
    sortBy: string;
    showName: boolean;
    showDescription: boolean;
    showPrice: boolean;
    showImage: boolean;
  };
  appointmentConfig?: {
    title: string;
  };
}

/**
 * Parses HTML content and extracts product-list and appointment-booking divs as separate segments
 */
function parseContentSegments(html: string): ContentSegment[] {
  const segments: ContentSegment[] = [];

  // Regex to match product-list and appointment-booking divs
  const productListRegex =
    /<div[^>]*class="product-list"[^>]*>[\s\S]*?<\/div>/gi;
  const appointmentBookingRegex =
    /<div[^>]*class="appointment-booking"[^>]*>[\s\S]*?<\/div>/gi;

  // Find all special divs and their positions
  interface DivMatch {
    type: 'productList' | 'appointmentBooking';
    index: number;
    length: number;
    html: string;
  }

  const matches: DivMatch[] = [];

  let match;
  while ((match = productListRegex.exec(html)) !== null) {
    matches.push({
      type: 'productList',
      index: match.index,
      length: match[0].length,
      html: match[0],
    });
  }

  while ((match = appointmentBookingRegex.exec(html)) !== null) {
    matches.push({
      type: 'appointmentBooking',
      index: match.index,
      length: match[0].length,
      html: match[0],
    });
  }

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);

  let lastIndex = 0;

  for (const divMatch of matches) {
    // Add HTML before this div
    if (divMatch.index > lastIndex) {
      const htmlContent = html.substring(lastIndex, divMatch.index);
      if (htmlContent.trim()) {
        segments.push({ type: 'html', content: htmlContent });
      }
    }

    if (divMatch.type === 'productList') {
      // Parse the product list attributes
      const divHtml = divMatch.html;
      const categoryIdsMatch = divHtml.match(/data-category-ids="([^"]*)"/);
      const layoutMatch = divHtml.match(/data-layout="([^"]*)"/);
      const sortByMatch = divHtml.match(/data-sort-by="([^"]*)"/);
      const showNameMatch = divHtml.match(/data-show-name="([^"]*)"/);
      const showDescriptionMatch = divHtml.match(
        /data-show-description="([^"]*)"/
      );
      const showPriceMatch = divHtml.match(/data-show-price="([^"]*)"/);
      const showImageMatch = divHtml.match(/data-show-image="([^"]*)"/);

      const categoryIdsStr = categoryIdsMatch ? categoryIdsMatch[1] : '';
      const categoryIds = categoryIdsStr
        ? categoryIdsStr.split(',').filter((id) => id.trim() !== '')
        : null;

      segments.push({
        type: 'productList',
        config: {
          categoryIds:
            categoryIds && categoryIds.length > 0 ? categoryIds : null,
          layout: (layoutMatch ? layoutMatch[1] : 'grid') as 'grid' | 'list',
          sortBy: sortByMatch ? sortByMatch[1] : 'displayOrder',
          showName: showNameMatch ? showNameMatch[1] !== 'false' : true,
          showDescription: showDescriptionMatch
            ? showDescriptionMatch[1] !== 'false'
            : true,
          showPrice: showPriceMatch ? showPriceMatch[1] !== 'false' : true,
          showImage: showImageMatch ? showImageMatch[1] !== 'false' : true,
        },
      });
    } else if (divMatch.type === 'appointmentBooking') {
      // Parse appointment booking attributes
      const divHtml = divMatch.html;
      const titleMatch = divHtml.match(/data-title="([^"]*)"/);

      segments.push({
        type: 'appointmentBooking',
        appointmentConfig: {
          title: titleMatch ? titleMatch[1] : 'Prendre rendez-vous',
        },
      });
    }

    lastIndex = divMatch.index + divMatch.length;
  }

  // Add remaining HTML after last special div
  if (lastIndex < html.length) {
    const htmlContent = html.substring(lastIndex);
    if (htmlContent.trim()) {
      segments.push({ type: 'html', content: htmlContent });
    }
  }

  // If no special divs found, return the whole content as HTML
  if (segments.length === 0 && html.trim()) {
    segments.push({ type: 'html', content: html });
  }

  return segments;
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

// Sanitize configuration for DOMPurify
const SANITIZE_CONFIG = {
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
  ADD_TAGS: [] as string[],
  ADD_ATTR: [] as string[],
};

function HtmlSegment({ content }: { content: string }): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      applyTableColumnWidths(ref.current);
    }
  }, [content]);

  const sanitizedContent = useMemo(
    () => DOMPurify.sanitize(content, SANITIZE_CONFIG),
    [content]
  );

  return (
    <Box
      ref={ref}
      className="public-page-content"
      overflow="visible"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
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

  const segments = useMemo(
    () => parseContentSegments(content || ''),
    [content]
  );

  if (!content) {
    return (
      <Box textAlign="center" py={12} px={4} bg="bg.subtle" borderRadius="lg">
        <Text color="fg.muted" fontSize="lg">
          Cette page n&apos;a pas encore de contenu.
        </Text>
      </Box>
    );
  }

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === 'html' && segment.content) {
          return <HtmlSegment key={index} content={segment.content} />;
        }
        if (segment.type === 'productList' && segment.config) {
          return (
            <Box key={index} className="public-page-content" my={4}>
              <ProductListRenderer
                categoryIds={segment.config.categoryIds}
                layout={segment.config.layout}
                sortBy={segment.config.sortBy}
                showName={segment.config.showName}
                showDescription={segment.config.showDescription}
                showPrice={segment.config.showPrice}
                showImage={segment.config.showImage}
              />
            </Box>
          );
        }
        if (
          segment.type === 'appointmentBooking' &&
          segment.appointmentConfig
        ) {
          return (
            <Box key={index} className="public-page-content" my={4}>
              <AppointmentBookingRenderer />
            </Box>
          );
        }
        return null;
      })}
    </>
  );
}
