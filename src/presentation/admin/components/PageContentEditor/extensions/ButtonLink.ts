import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    buttonLink: {
      insertButtonLink: (text?: string, url?: string) => ReturnType;
      updateButtonLink: (attrs: { text?: string; url?: string }) => ReturnType;
      removeButtonLink: () => ReturnType;
    };
  }
}

export const ButtonLink = Node.create({
  name: 'buttonLink',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      text: {
        default: 'Cliquez ici',
        parseHTML: (element: HTMLElement): string => {
          const anchor = element.querySelector('a');
          return anchor?.textContent ?? element.textContent ?? 'Cliquez ici';
        },
        renderHTML: (): Record<string, string> => ({}),
      },
      url: {
        default: '#',
        parseHTML: (element: HTMLElement): string => {
          const anchor = element.querySelector('a');
          return (
            anchor?.getAttribute('href') ??
            element.getAttribute('data-url') ??
            '#'
          );
        },
        renderHTML: (
          attributes: Record<string, string>
        ): Record<string, string> => ({
          'data-url': attributes.url,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.button-link-wrapper',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { text, url } = node.attrs as { text: string; url: string };

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'button-link-wrapper',
        'data-url': url,
      }),
      [
        'a',
        {
          class: 'button-link',
          href: url,
        },
        text,
      ],
    ];
  },

  addCommands() {
    return {
      insertButtonLink:
        (text = 'Cliquez ici', url = '#') =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { text, url },
          });
        },
      updateButtonLink:
        (attrs) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        },
      removeButtonLink:
        () =>
        ({ commands }) => {
          return commands.deleteSelection();
        },
    };
  },
});
