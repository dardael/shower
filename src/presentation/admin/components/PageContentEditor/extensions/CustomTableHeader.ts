import { TableHeader } from '@tiptap/extension-table-header';
import { createVerticalAlignAttribute } from '../tableFormatTypes';

/**
 * Custom TableHeader extension that adds vertical alignment attribute
 * Same as CustomTableCell for consistency
 */
export const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      verticalAlign: createVerticalAlignAttribute(),
    };
  },
});
