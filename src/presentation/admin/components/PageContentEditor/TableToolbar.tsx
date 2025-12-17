'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import {
  HStack,
  IconButton,
  Separator,
  Text,
  Box,
  Input,
} from '@chakra-ui/react';
import {
  LuTableRowsSplit,
  LuTableColumnsSplit,
  LuTrash2,
  LuMerge,
  LuSplit,
  LuPlus,
  LuMinus,
  LuAlignVerticalJustifyStart,
  LuAlignVerticalJustifyCenter,
  LuAlignVerticalJustifyEnd,
} from 'react-icons/lu';
import { Tooltip } from '@/presentation/shared/components/ui/tooltip';
import { findParentNode } from '@tiptap/core';
import {
  BORDER_THICKNESS_MIN,
  BORDER_THICKNESS_MAX,
  BORDER_THICKNESS_DEFAULT,
  VERTICAL_ALIGN_DEFAULT,
  COLUMN_WIDTH_MIN,
  type VerticalAlignment,
} from './tableFormatTypes';

interface TableToolbarProps {
  editor: Editor;
  disabled?: boolean;
}

/**
 * Gets the current border thickness of the table containing the cursor.
 */
function getCurrentBorderThickness(editor: Editor): number {
  const { selection } = editor.state;
  const tableNode = findParentNode((node) => node.type.name === 'table')(
    selection
  );
  if (tableNode) {
    return tableNode.node.attrs.borderThickness ?? BORDER_THICKNESS_DEFAULT;
  }
  return BORDER_THICKNESS_DEFAULT;
}

/**
 * Updates the border thickness of the current table.
 */
function updateTableBorderThickness(
  editor: Editor,
  borderThickness: number
): void {
  editor.chain().focus().updateAttributes('table', { borderThickness }).run();
}

/**
 * Gets the current vertical alignment of the selected cell.
 */
function getCurrentVerticalAlign(editor: Editor): VerticalAlignment {
  const cellAttrs = editor.getAttributes('tableCell');
  const headerAttrs = editor.getAttributes('tableHeader');
  return (cellAttrs.verticalAlign ||
    headerAttrs.verticalAlign ||
    VERTICAL_ALIGN_DEFAULT) as VerticalAlignment;
}

/**
 * Updates the vertical alignment of the selected cell(s).
 */
function updateCellVerticalAlign(
  editor: Editor,
  verticalAlign: VerticalAlignment
): void {
  // Update both tableCell and tableHeader to handle both types
  editor
    .chain()
    .focus()
    .updateAttributes('tableCell', { verticalAlign })
    .updateAttributes('tableHeader', { verticalAlign })
    .run();
}

/**
 * Gets the current column width of the selected cell.
 * Returns empty string if no explicit width is set (auto-adapt mode).
 */
function getCurrentColumnWidth(editor: Editor): string {
  const cellAttrs = editor.getAttributes('tableCell');
  const headerAttrs = editor.getAttributes('tableHeader');
  const width = cellAttrs.colwidth || headerAttrs.colwidth;
  return width ? String(width) : '';
}

/**
 * Updates the column width of the selected cell(s).
 * Empty or null value means auto-adapt to table width.
 */
function updateCellColumnWidth(editor: Editor, width: number | null): void {
  editor
    .chain()
    .focus()
    .updateAttributes('tableCell', { colwidth: width })
    .updateAttributes('tableHeader', { colwidth: width })
    .run();
}

export function TableToolbar({
  editor,
  disabled = false,
}: TableToolbarProps): React.ReactElement {
  const [canDeleteRow, setCanDeleteRow] = useState(false);
  const [canDeleteColumn, setCanDeleteColumn] = useState(false);
  const [canMergeCells, setCanMergeCells] = useState(false);
  const [canSplitCell, setCanSplitCell] = useState(false);
  const [borderThickness, setBorderThickness] = useState(
    BORDER_THICKNESS_DEFAULT
  );
  const [verticalAlign, setVerticalAlign] = useState<VerticalAlignment>(
    VERTICAL_ALIGN_DEFAULT
  );
  const [columnWidth, setColumnWidth] = useState<string>('');

  const updateCanStates = useCallback((): void => {
    setCanDeleteRow(editor.can().deleteRow());
    setCanDeleteColumn(editor.can().deleteColumn());
    setCanMergeCells(editor.can().mergeCells());
    setCanSplitCell(editor.can().splitCell());
    setBorderThickness(getCurrentBorderThickness(editor));
    setVerticalAlign(getCurrentVerticalAlign(editor));
    setColumnWidth(getCurrentColumnWidth(editor));
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

  const handleBorderThicknessChange = useCallback(
    (details: { value: string }): void => {
      const value = parseInt(details.value, 10);
      if (
        !isNaN(value) &&
        value >= BORDER_THICKNESS_MIN &&
        value <= BORDER_THICKNESS_MAX
      ) {
        setBorderThickness(value);
        updateTableBorderThickness(editor, value);
      }
    },
    [editor]
  );

  const handleVerticalAlignChange = useCallback(
    (align: VerticalAlignment): void => {
      setVerticalAlign(align);
      updateCellVerticalAlign(editor, align);
    },
    [editor]
  );

  const handleColumnWidthChange = useCallback(
    (value: string): void => {
      setColumnWidth(value);
      if (value === '') {
        // Empty input: auto-adapt mode
        updateCellColumnWidth(editor, null);
      } else {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= COLUMN_WIDTH_MIN) {
          updateCellColumnWidth(editor, numValue);
        }
      }
    },
    [editor]
  );

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

      {/* Border thickness control */}
      <Tooltip content="Border Thickness (0-10px)">
        <Box display="flex" alignItems="center" gap={1}>
          <Text fontSize="xs" color="fg.muted">
            Border:
          </Text>
          <Input
            type="number"
            size="xs"
            width="50px"
            min={BORDER_THICKNESS_MIN}
            max={BORDER_THICKNESS_MAX}
            value={borderThickness}
            onChange={(e) =>
              handleBorderThicknessChange({ value: e.target.value })
            }
            disabled={disabled}
          />
          <Text fontSize="xs" color="fg.muted">
            px
          </Text>
        </Box>
      </Tooltip>

      <Separator orientation="vertical" height="20px" />

      {/* Vertical alignment controls */}
      <Text fontSize="xs" color="fg.muted" mr={1}>
        Align:
      </Text>
      <Tooltip content="Align Top">
        <IconButton
          aria-label="Align Top"
          size="xs"
          variant={verticalAlign === 'top' ? 'solid' : 'ghost'}
          onClick={() => handleVerticalAlignChange('top')}
          disabled={disabled}
        >
          <LuAlignVerticalJustifyStart />
        </IconButton>
      </Tooltip>
      <Tooltip content="Align Middle">
        <IconButton
          aria-label="Align Middle"
          size="xs"
          variant={verticalAlign === 'middle' ? 'solid' : 'ghost'}
          onClick={() => handleVerticalAlignChange('middle')}
          disabled={disabled}
        >
          <LuAlignVerticalJustifyCenter />
        </IconButton>
      </Tooltip>
      <Tooltip content="Align Bottom">
        <IconButton
          aria-label="Align Bottom"
          size="xs"
          variant={verticalAlign === 'bottom' ? 'solid' : 'ghost'}
          onClick={() => handleVerticalAlignChange('bottom')}
          disabled={disabled}
        >
          <LuAlignVerticalJustifyEnd />
        </IconButton>
      </Tooltip>

      <Separator orientation="vertical" height="20px" />

      {/* Column width control */}
      <Tooltip content="Column Width (min 50px, empty for auto)">
        <Box display="flex" alignItems="center" gap={1}>
          <Text fontSize="xs" color="fg.muted">
            Width:
          </Text>
          <Input
            type="number"
            size="xs"
            width="60px"
            min={COLUMN_WIDTH_MIN}
            placeholder="auto"
            value={columnWidth}
            onChange={(e) => handleColumnWidthChange(e.target.value)}
            disabled={disabled}
          />
          <Text fontSize="xs" color="fg.muted">
            px
          </Text>
        </Box>
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
