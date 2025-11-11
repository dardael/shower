'use client';

import { Box, VStack, HStack, Text, Button, Spinner } from '@chakra-ui/react';
import { memo, useState, useEffect } from 'react';
import {
  ThemeColorToken,
  getAvailableThemeColors,
} from '@/domain/settings/constants/ThemeColorPalette';

interface ThemeColorSelectorProps {
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
        aria-label={`Select ${color} theme color`}
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
            bg={`${color}.600`}
            border={isSelected ? '2px solid' : '1px solid'}
            borderColor={isSelected ? `${color}.300` : 'border.subtle'}
            _after={
              isSelected
                ? {
                    content: '""',
                    position: 'absolute',
                    inset: '-4px',
                    border: '2px solid',
                    borderColor: `${color}.400`,
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

ColorButton.displayName = 'ColorButton';

const ThemeColorSelector = memo<ThemeColorSelectorProps>(
  ({ selectedColor, onColorChange, disabled = false, isLoading = false }) => {
    const availableColors = getAvailableThemeColors();
    const textColor = 'fg.muted';
    const [announcement, setAnnouncement] = useState('');

    // Announce theme color changes for screen readers
    useEffect(() => {
      if (selectedColor) {
        setAnnouncement(`Theme color changed to ${selectedColor}`);
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
            data-testid="theme-color-label"
          >
            Theme Color
          </Text>
          {isLoading && (
            <Spinner
              size="sm"
              color="fg.muted"
              aria-label="Updating theme color"
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

        <Text fontSize="sm" color={textColor} opacity={0.7}>
          {isLoading
            ? 'Updating theme color...'
            : 'Select a color to customize your website theme'}
        </Text>
      </VStack>
    );
  }
);

ThemeColorSelector.displayName = 'ThemeColorSelector';

export { ThemeColorSelector };
