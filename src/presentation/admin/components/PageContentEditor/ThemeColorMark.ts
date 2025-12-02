import { Mark } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    themeColor: {
      setThemeColor: () => ReturnType;
      toggleThemeColor: () => ReturnType;
      unsetThemeColor: () => ReturnType;
    };
  }
}

export const ThemeColorMark = Mark.create({
  name: 'themeColor',

  parseHTML() {
    return [
      { tag: 'span.theme-color-text' },
      { tag: 'span[data-theme-color]' },
    ];
  },

  renderHTML() {
    return [
      'span',
      { class: 'theme-color-text', 'data-theme-color': 'true' },
      0,
    ];
  },

  addCommands() {
    return {
      setThemeColor:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      toggleThemeColor:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
      unsetThemeColor:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
