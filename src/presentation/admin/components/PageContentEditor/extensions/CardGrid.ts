import { Node, mergeAttributes } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    cardGrid: {
      insertCardGrid: (cardCount?: number) => ReturnType;
      addCardToGrid: () => ReturnType;
      removeCardFromGrid: () => ReturnType;
      moveCardInGrid: (direction: 'left' | 'right') => ReturnType;
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

      moveCardInGrid:
        (direction) =>
        ({ state, dispatch }) => {
          const { selection } = state;
          let cardPos = -1;
          let cardNode: ProseMirrorNode | undefined;
          let gridPos = -1;
          let gridNode: ProseMirrorNode | undefined;

          state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (node.type.name === 'cardGrid') {
              gridPos = pos;
              gridNode = node;
            }
            if (node.type.name === 'card') {
              cardPos = pos;
              cardNode = node;
              return false;
            }
            return true;
          });

          if (!cardNode || !gridNode || cardPos < 0 || gridPos < 0) {
            return false;
          }

          // Find the index of the current card within the grid
          let cardIndex = 0;
          let offset = gridPos + 1;
          for (let i = 0; i < gridNode.childCount; i++) {
            if (offset === cardPos) {
              cardIndex = i;
              break;
            }
            offset += gridNode.child(i).nodeSize;
          }

          const targetIndex =
            direction === 'left' ? cardIndex - 1 : cardIndex + 1;
          if (targetIndex < 0 || targetIndex >= gridNode.childCount) {
            return false;
          }

          if (dispatch) {
            const tr = state.tr;
            const targetCard = gridNode.child(targetIndex);

            if (direction === 'left') {
              const targetPos = cardPos - targetCard.nodeSize;
              tr.delete(cardPos, cardPos + cardNode.nodeSize);
              tr.insert(targetPos, cardNode);
            } else {
              const targetPos = cardPos + cardNode.nodeSize;
              tr.insert(targetPos + targetCard.nodeSize, cardNode);
              tr.delete(cardPos, cardPos + cardNode.nodeSize);
            }

            dispatch(tr);
          }

          return true;
        },
    };
  },
});
