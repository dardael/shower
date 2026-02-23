import { Node, mergeAttributes } from '@tiptap/core';

export const CardTitle = Node.create({
  name: 'cardTitle',
  content: 'block*',
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div.card-title' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'card-title' }), 0];
  },
});
