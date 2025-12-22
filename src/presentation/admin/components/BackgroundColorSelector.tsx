'use client';

import { Box, VStack, HStack, Text, Button, Spinner } from '@chakra-ui/react';
import { memo, useState, useEffect } from 'react';
import {
  ThemeColorToken,
  getAvailableThemeColors,
} from '@/domain/settings/constants/ThemeColorPalette';
import { useColorMode } from '@/presentation/shared/components/ui/color-mode';
import { BACKGROUND_COLOR_MAP } from '@/presentation/shared/components/ui/provider';

// Custom colors need explicit hex values since they don't have Chakra's numbered scale
const CUSTOM_COLOR_DISPLAY: Partial<Record<ThemeColorToken, string>> = {
  beige: '#cdb99d',
  cream: '#ede6dd',
};

function getColorDisplayValue(color: ThemeColorToken): string {
  return CUSTOM_COLOR_DISPLAY[color] ?? `${color}.600`;
}

function getColorBorderValue(
  color: ThemeColorToken,
  variant: '300' | '400'
): string {
  if (CUSTOM_COLOR_DISPLAY[color]) {
    return variant === '300' ? '#d4c4a8' : '#a89070';
  }
  return `${color}.${variant}`;
}

interface BackgroundColorSelectorProps {
  selectedColor: ThemeColorToken;
  onColorChange: (color: ThemeColorToken) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

interface ColorButtonProps {
  color: ThemeColorToken;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
  isLoading?: boolean;
}

// Memoized color button to prevent unnecessary re-renders
const ColorButton = memo<ColorButtonProps>(
  ({ color, isSelected, onClick, disabled, isLoading = false }) => {
    return (
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant={isSelected ? 'solid' : 'outline'}
        size="sm"
        width="60px"
        height="40px"
        position="relative"
        aria-label={`Sélectionner la couleur de fond ${color}`}
        data-selected={isSelected}
        opacity={isLoading ? 0.7 : 1}
      >
        {isLoading ? (
          <Spinner size="sm" color="fg.muted" />
        ) : (
          <Box
            width="24px"
            height="24px"
            borderRadius="md"
            bg={getColorDisplayValue(color)}
            border={isSelected ? '2px solid' : '1px solid'}
            borderColor={
              isSelected ? getColorBorderValue(color, '300') : 'border.subtle'
            }
            _after={
              isSelected
                ? {
                    content: '""',
                    position: 'absolute',
                    inset: '-4px',
                    border: '2px solid',
                    borderColor: getColorBorderValue(color, '400'),
                    borderRadius: 'md',
                  }
                : undefined
            }
          />
        )}
      </Button>
    );
  }
);

ColorButton.displayName = 'BackgroundColorButton';

const BackgroundColorSelector = memo<BackgroundColorSelectorProps>(
  ({ selectedColor, onColorChange, disabled = false, isLoading = false }) => {
    const availableColors = getAvailableThemeColors();
    const { colorMode } = useColorMode();
    const textColor = 'fg.muted';
    const [announcement, setAnnouncement] = useState('');

    // Get the actual background color hex value based on current color mode
    const previewBackgroundColor =
      BACKGROUND_COLOR_MAP[selectedColor][colorMode];

    // Announce background color changes for screen readers
    useEffect(() => {
      if (selectedColor) {
        setAnnouncement(`Couleur de fond changée en ${selectedColor}`);
        // Clear announcement after it's read
        const timer = setTimeout(() => setAnnouncement(''), 1000);
        return () => clearTimeout(timer);
      }
    }, [selectedColor]);

    return (
      <VStack gap={4} align="start" width="full">
        {/* ARIA live region for screen reader announcements */}
        <Box
          position="absolute"
          width="1px"
          height="1px"
          padding={0}
          margin="-1px"
          overflow="hidden"
          clip="rect(0, 0, 0, 0)"
          border={0}
          aria-live="polite"
          aria-atomic="true"
          whiteSpace="nowrap"
        >
          {announcement}
        </Box>

        <HStack gap={2} align="center">
          <Text
            fontSize="md"
            fontWeight="medium"
            color={textColor}
            data-testid="background-color-label"
          >
            Couleur de fond
          </Text>
          {isLoading && (
            <Spinner
              size="sm"
              color="fg.muted"
              aria-label="Mise à jour de la couleur de fond"
            />
          )}
        </HStack>

        <HStack gap={3} wrap="wrap" width="full">
          {availableColors.map((color) => {
            const isSelected = selectedColor === color;

            return (
              <ColorButton
                key={color}
                color={color}
                isSelected={isSelected}
                onClick={() => onColorChange(color)}
                disabled={disabled}
                isLoading={isLoading}
              />
            );
          })}
        </HStack>

        {/* Background Color Preview */}
        <VStack gap={2} align="start" width="full">
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            Aperçu
          </Text>
          <Box
            data-testid="background-color-preview"
            width="full"
            height="60px"
            borderRadius="md"
            style={{ backgroundColor: previewBackgroundColor }}
            border="1px solid"
            borderColor="border.subtle"
          />
        </VStack>

        <Text fontSize="sm" color={textColor} opacity={0.7}>
          {isLoading
            ? 'Mise à jour de la couleur de fond...'
            : 'Sélectionnez une couleur pour personnaliser le fond de votre site'}
        </Text>
      </VStack>
    );
  }
);

BackgroundColorSelector.displayName = 'BackgroundColorSelector';

export { BackgroundColorSelector };
