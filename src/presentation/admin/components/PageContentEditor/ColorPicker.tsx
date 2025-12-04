'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  Popover as ChakraPopover,
} from '@chakra-ui/react';
import { MdFormatColorText, MdFormatColorReset } from 'react-icons/md';
import type { Editor } from '@tiptap/react';

export const PRESET_COLORS: readonly string[] = [
  '#000000',
  '#FFFFFF',
  '#EF4444',
  '#F97316',
  '#EAB308',
  '#22C55E',
  '#06B6D4',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#6B7280',
  '#78716C',
] as const;

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const isValidHexColor = (color: string): boolean => {
  return HEX_COLOR_REGEX.test(color);
};

interface ColorPickerProps {
  editor: Editor;
  disabled?: boolean;
}

interface PopoverOpenChangeDetails {
  open: boolean;
}

export function ColorPicker({
  editor,
  disabled = false,
}: ColorPickerProps): React.ReactElement {
  const [hexInput, setHexInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleColorSelect = useCallback(
    (color: string): void => {
      editor.chain().focus().setColor(color).run();
      setIsOpen(false);
    },
    [editor]
  );

  const handleHexInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setHexInput(event.target.value);
    },
    []
  );

  const handleHexInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === 'Enter') {
        const color = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
        if (isValidHexColor(color)) {
          handleColorSelect(color);
          setHexInput('');
        }
      }
    },
    [hexInput, handleColorSelect]
  );

  const handleRemoveColor = useCallback((): void => {
    editor.chain().focus().unsetColor().run();
    setIsOpen(false);
  }, [editor]);

  return (
    <ChakraPopover.Root
      open={isOpen}
      onOpenChange={(e: PopoverOpenChangeDetails) => setIsOpen(e.open)}
    >
      <ChakraPopover.Trigger asChild>
        <IconButton
          aria-label="Text Color"
          size="sm"
          variant={editor.isActive('textStyle') ? 'solid' : 'ghost'}
          color={editor.isActive('textStyle') ? 'colorPalette.fg' : 'fg'}
          disabled={disabled}
        >
          <MdFormatColorText />
        </IconButton>
      </ChakraPopover.Trigger>
      <ChakraPopover.Positioner>
        <ChakraPopover.Content width="auto">
          <ChakraPopover.Body>
            <Box p={2}>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Text Color
              </Text>
              <SimpleGrid columns={4} gap={1} mb={3}>
                {PRESET_COLORS.map((color) => (
                  <IconButton
                    key={color}
                    aria-label={`Select color ${color}`}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleColorSelect(color)}
                    p={0}
                    minW="28px"
                    h="28px"
                  >
                    <Box
                      w="20px"
                      h="20px"
                      borderRadius="sm"
                      bg={color}
                      borderWidth="1px"
                      borderColor={color === '#FFFFFF' ? 'gray.300' : color}
                    />
                  </IconButton>
                ))}
              </SimpleGrid>
              <Input
                size="sm"
                placeholder="Hex color (#FF0000)"
                value={hexInput}
                onChange={handleHexInputChange}
                onKeyDown={handleHexInputKeyDown}
                mb={2}
              />
              <IconButton
                aria-label="Remove color"
                size="sm"
                variant="ghost"
                width="100%"
                onClick={handleRemoveColor}
              >
                <MdFormatColorReset />
                <Text ml={2} fontSize="sm">
                  Remove color
                </Text>
              </IconButton>
            </Box>
          </ChakraPopover.Body>
        </ChakraPopover.Content>
      </ChakraPopover.Positioner>
    </ChakraPopover.Root>
  );
}
