import { Table } from '@tiptap/extension-table';
import { mergeAttributes } from '@tiptap/core';
import {
  BORDER_THICKNESS_DEFAULT,
  BORDER_THICKNESS_MIN,
  BORDER_THICKNESS_MAX,
} from '../tableFormatTypes';

/**
 * Custom Table extension that adds border thickness attribute
 * Stores value in data-border-thickness attribute and applies CSS variable
 */
export const CustomTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      borderThickness: {
        default: BORDER_THICKNESS_DEFAULT,
        parseHTML: (element) => {
          const value = element.getAttribute('data-border-thickness');
          if (value === null) {
            return BORDER_THICKNESS_DEFAULT;
          }
          const parsed = parseInt(value, 10);
          if (isNaN(parsed)) {
            return BORDER_THICKNESS_DEFAULT;
          }
          return Math.max(
            BORDER_THICKNESS_MIN,
            Math.min(BORDER_THICKNESS_MAX, parsed)
          );
        },
        renderHTML: (attributes) => {
          const thickness =
            attributes.borderThickness ?? BORDER_THICKNESS_DEFAULT;
          return {
            'data-border-thickness': String(thickness),
            style: `--table-border-width: ${thickness}px`,
          };
        },
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const thickness = node.attrs.borderThickness ?? BORDER_THICKNESS_DEFAULT;
    return [
      'table',
      mergeAttributes(HTMLAttributes, {
        class: 'tiptap-table',
        'data-border-thickness': String(thickness),
        style: `--table-border-width: ${thickness}px`,
      }),
      ['tbody', 0],
    ];
  },

  onTransaction({ editor }) {
    // Update table elements' attributes to reflect current node state
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'table') {
        const thickness =
          node.attrs.borderThickness ?? BORDER_THICKNESS_DEFAULT;

        try {
          const domAtPos = editor.view.domAtPos(pos + 1);

          // Find the table element
          let tableElement: HTMLTableElement | null = null;
          let current = domAtPos.node as HTMLElement;

          // Walk up to find the table element
          while (current && current !== editor.view.dom) {
            if (current instanceof HTMLTableElement) {
              tableElement = current;
              break;
            }
            current = current.parentElement as HTMLElement;
          }

          if (tableElement) {
            tableElement.setAttribute(
              'data-border-thickness',
              String(thickness)
            );
            tableElement.style.setProperty(
              '--table-border-width',
              `${thickness}px`
            );
          }
        } catch {
          // Ignore errors from invalid positions
        }
      }
    });
  },
}).configure({
  resizable: true,
  HTMLAttributes: {
    class: 'tiptap-table',
  },
});
