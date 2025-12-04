'use client';

import { useState, useCallback, useEffect } from 'react';
import { Box, Text, Button, Popover as ChakraPopover } from '@chakra-ui/react';
import {
  AVAILABLE_FONTS,
  getFontsByCategory,
  FONT_CATEGORY_LABELS,
  type FontCategory,
} from '@/domain/settings/constants/AvailableFonts';
import { loadGoogleFont } from '@/presentation/shared/utils/loadGoogleFont';

interface PopoverOpenChangeDetails {
  open: boolean;
}

interface FontPickerPopoverProps {
  /** Current selected font family */
  selectedFont: string;
  /** Callback when a font is selected */
  onFontSelect: (fontName: string) => void;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Title shown in the popover */
  title?: string;
  /** Trigger element to render */
  trigger: React.ReactNode;
}

// Track if fonts have been loaded to avoid redundant iteration
let fontsLoaded = false;

/**
 * Reusable font picker popover component.
 * Displays fonts organized by category with preview.
 */
export function FontPickerPopover({
  selectedFont,
  onFontSelect,
  disabled = false,
  title = 'Font',
  trigger,
}: FontPickerPopoverProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const fontsByCategory = getFontsByCategory();

  // Load fonts when picker opens (only once per session)
  useEffect(() => {
    if (isOpen && !fontsLoaded) {
      AVAILABLE_FONTS.forEach((font) => {
        loadGoogleFont(font.name);
      });
      fontsLoaded = true;
    }
  }, [isOpen]);

  const handleFontSelect = useCallback(
    (fontName: string): void => {
      onFontSelect(fontName);
      setIsOpen(false);
    },
    [onFontSelect]
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
        <ChakraPopover.Content width="auto" maxH="300px" overflowY="auto">
          <ChakraPopover.Body>
            <Box p={2}>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="fg">
                {title}
              </Text>
              {(Object.keys(fontsByCategory) as FontCategory[]).map(
                (category) => (
                  <Box key={category} mb={3}>
                    <Text
                      fontSize="xs"
                      fontWeight="medium"
                      color="fg.muted"
                      mb={1}
                    >
                      {FONT_CATEGORY_LABELS[category]}
                    </Text>
                    {fontsByCategory[category].map((font) => (
                      <Button
                        key={font.name}
                        aria-label={font.name}
                        size="sm"
                        variant={selectedFont === font.name ? 'solid' : 'ghost'}
                        color={
                          selectedFont === font.name ? 'colorPalette.fg' : 'fg'
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
