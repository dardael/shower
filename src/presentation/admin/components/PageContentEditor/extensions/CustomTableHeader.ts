import { TableHeader } from '@tiptap/extension-table-header';
import {
  createVerticalAlignAttribute,
  createColumnWidthAttribute,
} from '../tableFormatTypes';

/**
 * Custom TableHeader extension that adds vertical alignment and column width attributes
 * Same as CustomTableCell for consistency
 */
export const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      verticalAlign: createVerticalAlignAttribute(),
      colwidth: createColumnWidthAttribute(),
    };
  },
});
