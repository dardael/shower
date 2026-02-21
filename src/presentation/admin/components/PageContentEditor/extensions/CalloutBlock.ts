import { Node, mergeAttributes } from '@tiptap/core';

export type CalloutVariant = 'info' | 'tip' | 'warning' | 'highlight';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    calloutBlock: {
      insertCalloutBlock: (
        variant?: CalloutVariant,
        emoji?: string,
        text?: string
      ) => ReturnType;
      removeCalloutBlock: () => ReturnType;
    };
  }
}

const VARIANT_DEFAULTS: Record<
  CalloutVariant,
  { emoji: string; placeholder: string }
> = {
  info: { emoji: 'ℹ️', placeholder: 'Information importante…' },
  tip: { emoji: '✨', placeholder: 'Conseil…' },
  warning: { emoji: '⚠️', placeholder: 'À noter…' },
  highlight: { emoji: '💡', placeholder: 'À retenir…' },
};

export const CalloutBlock = Node.create({
  name: 'calloutBlock',
  group: 'block',
  atom: false,
  draggable: true,
  content: 'paragraph+',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      variant: {
        default: 'info' as CalloutVariant,
        parseHTML: (element) =>
          (element.getAttribute('data-variant') as CalloutVariant) ?? 'info',
        renderHTML: (attributes) => ({ 'data-variant': attributes.variant }),
      },
      emoji: {
        default: 'ℹ️',
        parseHTML: (element) => element.getAttribute('data-emoji') ?? 'ℹ️',
        renderHTML: (attributes) => ({ 'data-emoji': attributes.emoji }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.callout-block' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { variant, emoji } = node.attrs as {
      variant: CalloutVariant;
      emoji: string;
    };
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `callout-block callout-block--${variant}`,
        'data-variant': variant,
        'data-emoji': emoji,
      }),
      [
        'span',
        { class: 'callout-block__emoji', contenteditable: 'false' },
        emoji,
      ],
      ['div', { class: 'callout-block__content' }, 0],
    ];
  },

  addCommands() {
    return {
      insertCalloutBlock:
        (variant: CalloutVariant = 'info', emoji?: string, text?: string) =>
        ({ commands }) => {
          const defaults = VARIANT_DEFAULTS[variant];
          const resolvedEmoji = emoji ?? defaults.emoji;
          const resolvedText = text ?? defaults.placeholder;
          return commands.insertContent({
            type: this.name,
            attrs: { variant, emoji: resolvedEmoji },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: resolvedText }],
              },
            ],
          });
        },
      removeCalloutBlock:
        () =>
        ({ commands }) =>
          commands.deleteSelection(),
    };
  },
});
