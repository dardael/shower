import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    cardGrid: {
      insertCardGrid: (cardCount?: number) => ReturnType;
      addCardToGrid: () => ReturnType;
      removeCardFromGrid: () => ReturnType;
    };
  }
}

export const CardGrid = Node.create({
  name: 'cardGrid',
  group: 'block',
  content: 'card+',
  draggable: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div.card-grid' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'card-grid' }), 0];
  },

  addCommands() {
    return {
      insertCardGrid:
        (cardCount = 2) =>
        ({ chain }) => {
          const cards = Array.from({ length: cardCount }, () => ({
            type: 'card',
            content: [
              {
                type: 'cardTitle',
                content: [{ type: 'paragraph' }],
              },
              {
                type: 'cardBody',
                content: [{ type: 'paragraph' }],
              },
            ],
          }));

          return chain()
            .insertContent({
              type: 'cardGrid',
              content: cards,
            })
            .run();
        },

      addCardToGrid:
        () =>
        ({ state, chain }) => {
          const { selection } = state;
          let gridPos: number | null = null;
          let gridNode = null;

          // Find the cardGrid ancestor
          state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (node.type.name === 'cardGrid') {
              gridPos = pos;
              gridNode = node;
              return false;
            }
            return true;
          });

          if (gridPos === null || !gridNode) {
            return false;
          }

          // Insert a new card at the end of the grid
          const insertPos =
            gridPos +
            (gridNode as unknown as { nodeSize: number }).nodeSize -
            1;
          return chain()
            .insertContentAt(insertPos, {
              type: 'card',
              content: [
                {
                  type: 'cardTitle',
                  content: [{ type: 'paragraph' }],
                },
                {
                  type: 'cardBody',
                  content: [{ type: 'paragraph' }],
                },
              ],
            })
            .run();
        },

      removeCardFromGrid:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state;
          let cardPos: number | null = null;
          let cardNode = null;
          let gridNode = null;

          // Find the card and its parent grid
          state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (node.type.name === 'cardGrid') {
              gridNode = node;
            }
            if (node.type.name === 'card') {
              cardPos = pos;
              cardNode = node;
              return false;
            }
            return true;
          });

          if (
            cardPos === null ||
            !cardNode ||
            !gridNode ||
            (gridNode as unknown as { childCount: number }).childCount <= 1
          ) {
            return false;
          }

          if (dispatch) {
            const tr = state.tr;
            tr.delete(
              cardPos,
              cardPos + (cardNode as unknown as { nodeSize: number }).nodeSize
            );
            dispatch(tr);
          }

          return true;
        },
    };
  },
});
