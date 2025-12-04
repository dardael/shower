'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  IconButton,
  Text,
  Popover as ChakraPopover,
  Button,
} from '@chakra-ui/react';
import { MdTextFields } from 'react-icons/md';
import type { Editor } from '@tiptap/react';
import {
  AVAILABLE_FONTS,
  getFontsByCategory,
  type FontCategory,
} from '@/domain/settings/constants/AvailableFonts';
import { loadGoogleFont } from '@/presentation/shared/utils/loadGoogleFont';

interface FontPickerProps {
  editor: Editor;
  disabled?: boolean;
}

interface PopoverOpenChangeDetails {
  open: boolean;
}

const CATEGORY_LABELS: Record<FontCategory, string> = {
  'sans-serif': 'Sans Serif',
  serif: 'Serif',
  display: 'Display',
  handwriting: 'Handwriting',
  monospace: 'Monospace',
};

export function FontPicker({
  editor,
  disabled = false,
}: FontPickerProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const fontsByCategory = getFontsByCategory();

  const handleFontSelect = useCallback(
    (fontName: string): void => {
      editor.chain().focus().setFontFamily(fontName).run();
      setIsOpen(false);
    },
    [editor]
  );

  const handleRemoveFont = useCallback((): void => {
    editor.chain().focus().unsetFontFamily().run();
    setIsOpen(false);
  }, [editor]);

  const getActiveFontFamily = useCallback((): string | null => {
    const attributes = editor.getAttributes('textStyle');
    return attributes.fontFamily || null;
  }, [editor]);

  useEffect(() => {
    if (isOpen) {
      AVAILABLE_FONTS.forEach((font) => {
        loadGoogleFont(font.name);
      });
    }
  }, [isOpen]);

  const activeFontFamily = getActiveFontFamily();

  return (
    <ChakraPopover.Root
      open={isOpen}
      onOpenChange={(e: PopoverOpenChangeDetails) => setIsOpen(e.open)}
    >
      <ChakraPopover.Trigger asChild>
        <IconButton
          aria-label="Font"
          size="sm"
          variant={activeFontFamily ? 'solid' : 'ghost'}
          color={activeFontFamily ? 'colorPalette.fg' : 'fg'}
          disabled={disabled}
        >
          <MdTextFields />
        </IconButton>
      </ChakraPopover.Trigger>
      <ChakraPopover.Positioner>
        <ChakraPopover.Content width="auto" maxH="400px" overflowY="auto">
          <ChakraPopover.Body>
            <Box p={2}>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Font Family
              </Text>

              <Button
                aria-label="Default"
                size="sm"
                variant={!activeFontFamily ? 'solid' : 'ghost'}
                color={!activeFontFamily ? 'colorPalette.fg' : 'fg'}
                width="100%"
                justifyContent="flex-start"
                onClick={handleRemoveFont}
                mb={2}
              >
                Default
              </Button>

              {(Object.keys(fontsByCategory) as FontCategory[]).map(
                (category) => (
                  <Box key={category} mb={3}>
                    <Text
                      fontSize="xs"
                      fontWeight="medium"
                      color="fg.muted"
                      mb={1}
                    >
                      {CATEGORY_LABELS[category]}
                    </Text>
                    {fontsByCategory[category].map((font) => (
                      <Button
                        key={font.name}
                        aria-label={font.name}
                        size="sm"
                        variant={
                          activeFontFamily === font.name ? 'solid' : 'ghost'
                        }
                        color={
                          activeFontFamily === font.name
                            ? 'colorPalette.fg'
                            : 'fg'
                        }
                        width="100%"
                        justifyContent="flex-start"
                        onClick={() => handleFontSelect(font.name)}
                        fontFamily={font.name}
                        mb={1}
                      >
                        {font.name}
                      </Button>
                    ))}
                  </Box>
                )
              )}
            </Box>
          </ChakraPopover.Body>
        </ChakraPopover.Content>
      </ChakraPopover.Positioner>
    </ChakraPopover.Root>
  );
}
