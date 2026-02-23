import { Node, mergeAttributes } from '@tiptap/core';

export const Card = Node.create({
  name: 'card',
  group: '',
  content: 'cardTitle cardBody',
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div.card-item' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'card-item' }), 0];
  },
});
