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
