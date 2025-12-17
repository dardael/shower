import { TableCell } from '@tiptap/extension-table-cell';
import { createVerticalAlignAttribute } from '../tableFormatTypes';

/**
 * Custom TableCell extension that adds vertical alignment attribute
 * Stores value in data-vertical-align attribute
 */
export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      verticalAlign: createVerticalAlignAttribute(),
    };
  },
});
