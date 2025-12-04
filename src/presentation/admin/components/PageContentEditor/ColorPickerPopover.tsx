'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  HStack,
  IconButton,
  Input,
  Text,
  Popover as ChakraPopover,
} from '@chakra-ui/react';
import { PRESET_COLORS } from './ColorPicker';

interface PopoverOpenChangeDetails {
  open: boolean;
}

interface ColorPickerPopoverProps {
  /** Current selected color */
  selectedColor: string;
  /** Callback when a color is selected */
  onColorSelect: (color: string) => void;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Title shown in the popover */
  title?: string;
  /** Trigger element to render */
  trigger: React.ReactNode;
}

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

/**
 * Reusable color picker popover component.
 * Displays a grid of preset colors and a hex input field.
 */
export function ColorPickerPopover({
  selectedColor,
  onColorSelect,
  disabled = false,
  title = 'Color',
  trigger,
}: ColorPickerPopoverProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState('');

  const handleColorSelect = useCallback(
    (color: string): void => {
      onColorSelect(color);
      setIsOpen(false);
    },
    [onColorSelect]
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
        if (HEX_COLOR_REGEX.test(color)) {
          handleColorSelect(color);
          setHexInput('');
        }
      }
    },
    [hexInput, handleColorSelect]
  );

  return (
    <ChakraPopover.Root
      open={isOpen}
      onOpenChange={(e: PopoverOpenChangeDetails) => setIsOpen(e.open)}
    >
      <ChakraPopover.Trigger asChild disabled={disabled}>
        {trigger}
      </ChakraPopover.Trigger>
      <ChakraPopover.Positioner>
        <ChakraPopover.Content width="auto">
          <ChakraPopover.Body>
            <Box p={2}>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="fg">
                {title}
              </Text>
              <HStack gap={1} flexWrap="wrap" mb={3} maxW="160px">
                {PRESET_COLORS.map((color) => (
                  <IconButton
                    key={color}
                    aria-label={`Select color ${color}`}
                    size="sm"
                    variant={selectedColor === color ? 'solid' : 'ghost'}
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
              </HStack>
              <Input
                size="sm"
                placeholder="Hex color (#FF0000)"
                value={hexInput}
                onChange={handleHexInputChange}
                onKeyDown={handleHexInputKeyDown}
              />
            </Box>
          </ChakraPopover.Body>
        </ChakraPopover.Content>
      </ChakraPopover.Positioner>
    </ChakraPopover.Root>
  );
}
