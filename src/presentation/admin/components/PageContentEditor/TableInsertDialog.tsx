'use client';

import React, { useState } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Box,
  HStack,
  IconButton,
  Text,
  Popover as ChakraPopover,
} from '@chakra-ui/react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { LuTable } from 'react-icons/lu';

interface TableInsertDialogProps {
  editor: Editor;
  disabled?: boolean;
}

interface PopoverOpenChangeDetails {
  open: boolean;
}

const MIN_DIMENSION = 1;
const MAX_DIMENSION = 20;

export function TableInsertDialog({
  editor,
  disabled = false,
}: TableInsertDialogProps): React.ReactElement {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [isOpen, setIsOpen] = useState(false);

  const handleInsertTable = (): void => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: false })
      .run();
    setIsOpen(false);
    setRows(3);
    setCols(3);
  };

  const adjustValue = (
    currentValue: number,
    delta: number,
    setter: React.Dispatch<React.SetStateAction<number>>
  ): void => {
    const newValue = currentValue + delta;
    if (newValue >= MIN_DIMENSION && newValue <= MAX_DIMENSION) {
      setter(newValue);
    }
  };

  return (
    <ChakraPopover.Root
      open={isOpen}
      onOpenChange={(e: PopoverOpenChangeDetails) => setIsOpen(e.open)}
    >
      <ChakraPopover.Trigger asChild>
        <IconButton
          aria-label="Insert Table"
          size="sm"
          variant="ghost"
          color="fg"
          disabled={disabled}
          title="Insert Table"
        >
          <LuTable />
        </IconButton>
      </ChakraPopover.Trigger>
      <ChakraPopover.Positioner>
        <ChakraPopover.Content width="200px">
          <ChakraPopover.Body>
            <Box display="flex" flexDirection="column" gap={3} p={2}>
              <Text fontWeight="medium" fontSize="sm">
                Insert Table
              </Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Rows:</Text>
                <HStack>
                  <IconButton
                    aria-label="Decrease rows"
                    size="xs"
                    variant="ghost"
                    onClick={() => adjustValue(rows, -1, setRows)}
                    disabled={rows <= MIN_DIMENSION}
                  >
                    <FiMinus />
                  </IconButton>
                  <Text fontSize="sm" minW="24px" textAlign="center">
                    {rows}
                  </Text>
                  <IconButton
                    aria-label="Increase rows"
                    size="xs"
                    variant="ghost"
                    onClick={() => adjustValue(rows, 1, setRows)}
                    disabled={rows >= MAX_DIMENSION}
                  >
                    <FiPlus />
                  </IconButton>
                </HStack>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Columns:</Text>
                <HStack>
                  <IconButton
                    aria-label="Decrease columns"
                    size="xs"
                    variant="ghost"
                    onClick={() => adjustValue(cols, -1, setCols)}
                    disabled={cols <= MIN_DIMENSION}
                  >
                    <FiMinus />
                  </IconButton>
                  <Text fontSize="sm" minW="24px" textAlign="center">
                    {cols}
                  </Text>
                  <IconButton
                    aria-label="Increase columns"
                    size="xs"
                    variant="ghost"
                    onClick={() => adjustValue(cols, 1, setCols)}
                    disabled={cols >= MAX_DIMENSION}
                  >
                    <FiPlus />
                  </IconButton>
                </HStack>
              </HStack>
              <IconButton
                aria-label="Insert"
                size="sm"
                variant="solid"
                colorPalette="blue"
                onClick={handleInsertTable}
                width="100%"
              >
                Insert {rows}x{cols} Table
              </IconButton>
            </Box>
          </ChakraPopover.Body>
        </ChakraPopover.Content>
      </ChakraPopover.Positioner>
    </ChakraPopover.Root>
  );
}
