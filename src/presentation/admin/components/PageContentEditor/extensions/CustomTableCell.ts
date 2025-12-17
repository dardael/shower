import { TableCell } from '@tiptap/extension-table-cell';
import {
  createVerticalAlignAttribute,
  createColumnWidthAttribute,
} from '../tableFormatTypes';

/**
 * Custom TableCell extension that adds vertical alignment and column width attributes
 * Stores values in data-vertical-align and data-colwidth attributes
 */
export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      verticalAlign: createVerticalAlignAttribute(),
      colwidth: createColumnWidthAttribute(),
    };
  },
});
