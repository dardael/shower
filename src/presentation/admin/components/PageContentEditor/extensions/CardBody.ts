import { Node, mergeAttributes } from '@tiptap/core';

export const CardBody = Node.create({
  name: 'cardBody',
  content: 'block*',
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div.card-body' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'card-body' }), 0];
  },
});
