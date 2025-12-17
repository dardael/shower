/**
 * Type definitions for sheet/table cell formatting features
 * Used by custom Tiptap extensions and TableToolbar UI
 */

export type VerticalAlignment = 'top' | 'middle' | 'bottom';

export interface TableFormatAttributes {
  borderThickness: number;
}

export interface CellFormatAttributes {
  verticalAlign: VerticalAlignment;
}

export const BORDER_THICKNESS_MIN = 0;
export const BORDER_THICKNESS_MAX = 10;
export const BORDER_THICKNESS_DEFAULT = 1;
export const VERTICAL_ALIGN_DEFAULT: VerticalAlignment = 'top';
export const COLUMN_WIDTH_MIN = 50;
const COLUMN_WIDTH_DEFAULT: number | null = null;

const VALID_ALIGNMENTS: VerticalAlignment[] = ['top', 'middle', 'bottom'];

/**
 * Creates verticalAlign attribute configuration for Tiptap cell extensions.
 * Shared between CustomTableCell and CustomTableHeader to avoid duplication.
 */
export function createVerticalAlignAttribute(): {
  default: VerticalAlignment;
  parseHTML: (element: HTMLElement) => VerticalAlignment;
  renderHTML: (attributes: Record<string, unknown>) => Record<string, string>;
} {
  return {
    default: VERTICAL_ALIGN_DEFAULT,
    parseHTML: (element: HTMLElement): VerticalAlignment => {
      const value = element.getAttribute('data-vertical-align');
      if (value && VALID_ALIGNMENTS.includes(value as VerticalAlignment)) {
        return value as VerticalAlignment;
      }
      return VERTICAL_ALIGN_DEFAULT;
    },
    renderHTML: (
      attributes: Record<string, unknown>
    ): Record<string, string> => {
      const align =
        (attributes.verticalAlign as VerticalAlignment) ??
        VERTICAL_ALIGN_DEFAULT;
      // Only render attribute if not default (for cleaner HTML)
      if (align === VERTICAL_ALIGN_DEFAULT) {
        return {};
      }
      return {
        'data-vertical-align': align,
      };
    },
  };
}

/**
 * Creates colwidth attribute configuration for Tiptap cell extensions.
 * Stores column width in pixels. Null means auto-adapt to table width.
 * Shared between CustomTableCell and CustomTableHeader.
 */
export function createColumnWidthAttribute(): {
  default: number | null;
  parseHTML: (element: HTMLElement) => number | null;
  renderHTML: (attributes: Record<string, unknown>) => Record<string, string>;
} {
  return {
    default: COLUMN_WIDTH_DEFAULT,
    parseHTML: (element: HTMLElement): number | null => {
      const colwidth = element.getAttribute('data-colwidth');
      if (colwidth) {
        try {
          const widths = JSON.parse(colwidth);
          if (Array.isArray(widths) && widths.length > 0 && widths[0]) {
            const width = Number(widths[0]);
            return !isNaN(width) && width >= COLUMN_WIDTH_MIN ? width : null;
          }
        } catch {
          const width = parseInt(colwidth, 10);
          if (!isNaN(width) && width >= COLUMN_WIDTH_MIN) {
            return width;
          }
        }
      }
      return COLUMN_WIDTH_DEFAULT;
    },
    renderHTML: (
      attributes: Record<string, unknown>
    ): Record<string, string> => {
      const width = attributes.colwidth as number | null;
      if (width && width >= COLUMN_WIDTH_MIN) {
        return {
          'data-colwidth': JSON.stringify([width]),
          style: `width: ${width}px`,
        };
      }
      return {};
    },
  };
}
