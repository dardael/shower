'use client';

import type { Editor } from '@tiptap/react';
import { HStack, IconButton, Text } from '@chakra-ui/react';
import { Tooltip } from '@/presentation/shared/components/ui/tooltip';
import { LuPlus, LuMinus, LuTrash2 } from 'react-icons/lu';

interface CardToolbarProperties {
  editor: Editor;
  disabled: boolean;
}

export function CardToolbar({
  editor,
  disabled,
}: CardToolbarProperties): React.ReactElement {
  return (
    <HStack
      p={2}
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg.subtle"
      gap={1}
      flexWrap="wrap"
    >
      <Text fontSize="sm" fontWeight="bold" mr={2}>
        Cartes
      </Text>

      <Tooltip content="Ajouter une carte">
        <IconButton
          aria-label="Ajouter une carte"
          size="sm"
          variant="ghost"
          color="fg"
          onClick={() => editor.chain().focus().addCardToGrid().run()}
          disabled={disabled}
        >
          <LuPlus />
        </IconButton>
      </Tooltip>

      <Tooltip content="Supprimer cette carte">
        <IconButton
          aria-label="Supprimer cette carte"
          size="sm"
          variant="ghost"
          color="fg"
          onClick={() => editor.chain().focus().removeCardFromGrid().run()}
          disabled={disabled}
        >
          <LuMinus />
        </IconButton>
      </Tooltip>

      <Tooltip content="Supprimer toutes les cartes">
        <IconButton
          aria-label="Supprimer toutes les cartes"
          size="sm"
          variant="ghost"
          color="red.500"
          onClick={() => {
            editor.chain().focus().run();
            // Delete the whole card grid node
            const { state } = editor;
            const { selection } = state;
            let gridPos: number | null = null;
            let gridNodeSize = 0;

            state.doc.nodesBetween(
              selection.from,
              selection.to,
              (node, pos) => {
                if (node.type.name === 'cardGrid') {
                  gridPos = pos;
                  gridNodeSize = node.nodeSize;
                  return false;
                }
                return true;
              }
            );

            if (gridPos !== null) {
              const tr = state.tr;
              tr.delete(gridPos, gridPos + gridNodeSize);
              editor.view.dispatch(tr);
            }
          }}
          disabled={disabled}
        >
          <LuTrash2 />
        </IconButton>
      </Tooltip>
    </HStack>
  );
}
