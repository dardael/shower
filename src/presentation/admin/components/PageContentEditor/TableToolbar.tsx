'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import { HStack, IconButton, Separator, Text } from '@chakra-ui/react';
import {
  LuTableRowsSplit,
  LuTableColumnsSplit,
  LuTrash2,
  LuMerge,
  LuSplit,
  LuPlus,
  LuMinus,
} from 'react-icons/lu';
import { Tooltip } from '@/presentation/shared/components/ui/tooltip';

interface TableToolbarProps {
  editor: Editor;
  disabled?: boolean;
}

export function TableToolbar({
  editor,
  disabled = false,
}: TableToolbarProps): React.ReactElement {
  const [canDeleteRow, setCanDeleteRow] = useState(false);
  const [canDeleteColumn, setCanDeleteColumn] = useState(false);
  const [canMergeCells, setCanMergeCells] = useState(false);
  const [canSplitCell, setCanSplitCell] = useState(false);

  const updateCanStates = useCallback((): void => {
    setCanDeleteRow(editor.can().deleteRow());
    setCanDeleteColumn(editor.can().deleteColumn());
    setCanMergeCells(editor.can().mergeCells());
    setCanSplitCell(editor.can().splitCell());
  }, [editor]);

  useEffect(() => {
    // Update states on mount
    updateCanStates();

    // Listen to selection and transaction changes
    editor.on('selectionUpdate', updateCanStates);
    editor.on('transaction', updateCanStates);

    return () => {
      editor.off('selectionUpdate', updateCanStates);
      editor.off('transaction', updateCanStates);
    };
  }, [editor, updateCanStates]);

  return (
    <HStack
      p={2}
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg.subtle"
      flexWrap="wrap"
      gap={1}
    >
      <Text fontSize="xs" fontWeight="medium" color="fg.muted" mr={2}>
        Table:
      </Text>

      {/* Row operations */}
      <Tooltip content="Add Row Above">
        <IconButton
          aria-label="Add Row Above"
          size="xs"
          variant="ghost"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          disabled={disabled}
        >
          <LuPlus />
        </IconButton>
      </Tooltip>
      <Tooltip content="Add Row Below">
        <IconButton
          aria-label="Add Row Below"
          size="xs"
          variant="ghost"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={disabled}
        >
          <LuTableRowsSplit />
        </IconButton>
      </Tooltip>
      <Tooltip content="Delete Row">
        <IconButton
          aria-label="Delete Row"
          size="xs"
          variant="ghost"
          onClick={() => editor.chain().focus().deleteRow().run()}
          disabled={disabled || !canDeleteRow}
        >
          <LuMinus />
        </IconButton>
      </Tooltip>

      <Separator orientation="vertical" height="20px" />

      {/* Column operations */}
      <Tooltip content="Add Column Before">
        <IconButton
          aria-label="Add Column Before"
          size="xs"
          variant="ghost"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          disabled={disabled}
        >
          <LuPlus />
        </IconButton>
      </Tooltip>
      <Tooltip content="Add Column After">
        <IconButton
          aria-label="Add Column After"
          size="xs"
          variant="ghost"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={disabled}
        >
          <LuTableColumnsSplit />
        </IconButton>
      </Tooltip>
      <Tooltip content="Delete Column">
        <IconButton
          aria-label="Delete Column"
          size="xs"
          variant="ghost"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={disabled || !canDeleteColumn}
        >
          <LuMinus />
        </IconButton>
      </Tooltip>

      <Separator orientation="vertical" height="20px" />

      {/* Header toggle */}
      <Tooltip content="Toggle Header Cell">
        <IconButton
          aria-label="Toggle Header Cell"
          size="xs"
          variant={editor.isActive('tableHeader') ? 'solid' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeaderCell().run()}
          disabled={disabled}
        >
          <Text fontSize="xs" fontWeight="bold">
            H
          </Text>
        </IconButton>
      </Tooltip>

      <Separator orientation="vertical" height="20px" />

      {/* Merge/Split */}
      <Tooltip content="Merge Cells">
        <IconButton
          aria-label="Merge Cells"
          size="xs"
          variant="ghost"
          onClick={() => editor.chain().focus().mergeCells().run()}
          disabled={disabled || !canMergeCells}
        >
          <LuMerge />
        </IconButton>
      </Tooltip>
      <Tooltip content="Split Cell">
        <IconButton
          aria-label="Split Cell"
          size="xs"
          variant="ghost"
          onClick={() => editor.chain().focus().splitCell().run()}
          disabled={disabled || !canSplitCell}
        >
          <LuSplit />
        </IconButton>
      </Tooltip>

      <Separator orientation="vertical" height="20px" />

      {/* Delete table */}
      <Tooltip content="Delete Table">
        <IconButton
          aria-label="Delete Table"
          size="xs"
          variant="ghost"
          colorPalette="red"
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={disabled}
        >
          <LuTrash2 />
        </IconButton>
      </Tooltip>
    </HStack>
  );
}
