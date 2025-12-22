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
        Tableau :
      </Text>

      {/* Row operations */}
      <Tooltip content="Ajouter une ligne au-dessus">
        <IconButton
          aria-label="Ajouter une ligne au-dessus"
          size="xs"
          variant="ghost"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          disabled={disabled}
        >
          <LuPlus />
        </IconButton>
      </Tooltip>
      <Tooltip content="Ajouter une ligne en-dessous">
        <IconButton
          aria-label="Ajouter une ligne en-dessous"
          size="xs"
          variant="ghost"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={disabled}
        >
          <LuTableRowsSplit />
        </IconButton>
      </Tooltip>
      <Tooltip content="Supprimer la ligne">
        <IconButton
          aria-label="Supprimer la ligne"
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
      <Tooltip content="Ajouter une colonne avant">
        <IconButton
          aria-label="Ajouter une colonne avant"
          size="xs"
          variant="ghost"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          disabled={disabled}
        >
          <LuPlus />
        </IconButton>
      </Tooltip>
      <Tooltip content="Ajouter une colonne après">
        <IconButton
          aria-label="Ajouter une colonne après"
          size="xs"
          variant="ghost"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={disabled}
        >
          <LuTableColumnsSplit />
        </IconButton>
      </Tooltip>
      <Tooltip content="Supprimer la colonne">
        <IconButton
          aria-label="Supprimer la colonne"
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
      <Tooltip content="Activer/désactiver cellule d'en-tête">
        <IconButton
          aria-label="Activer/désactiver cellule d'en-tête"
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
      <Tooltip content="Fusionner les cellules">
        <IconButton
          aria-label="Fusionner les cellules"
          size="xs"
          variant="ghost"
          onClick={() => editor.chain().focus().mergeCells().run()}
          disabled={disabled || !canMergeCells}
        >
          <LuMerge />
        </IconButton>
      </Tooltip>
      <Tooltip content="Diviser la cellule">
        <IconButton
          aria-label="Diviser la cellule"
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
      <Tooltip content="Épaisseur de bordure (0-10px)">
        <Box display="flex" alignItems="center" gap={1}>
          <Text fontSize="xs" color="fg.muted">
            Bordure :
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
        Alignement :
      </Text>
      <Tooltip content="Aligner en haut">
        <IconButton
          aria-label="Aligner en haut"
          size="xs"
          variant={verticalAlign === 'top' ? 'solid' : 'ghost'}
          onClick={() => handleVerticalAlignChange('top')}
          disabled={disabled}
        >
          <LuAlignVerticalJustifyStart />
        </IconButton>
      </Tooltip>
      <Tooltip content="Aligner au milieu">
        <IconButton
          aria-label="Aligner au milieu"
          size="xs"
          variant={verticalAlign === 'middle' ? 'solid' : 'ghost'}
          onClick={() => handleVerticalAlignChange('middle')}
          disabled={disabled}
        >
          <LuAlignVerticalJustifyCenter />
        </IconButton>
      </Tooltip>
      <Tooltip content="Aligner en bas">
        <IconButton
          aria-label="Aligner en bas"
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
      <Tooltip content="Largeur de colonne (min 50px, vide pour auto)">
        <Box display="flex" alignItems="center" gap={1}>
          <Text fontSize="xs" color="fg.muted">
            Largeur :
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
      <Tooltip content="Supprimer le tableau">
        <IconButton
          aria-label="Supprimer le tableau"
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
