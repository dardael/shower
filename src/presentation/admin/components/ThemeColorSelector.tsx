'use client';

import { Box, VStack, HStack, Text, Button } from '@chakra-ui/react';
import {
  ThemeColorToken,
  getAvailableThemeColors,
} from '@/domain/settings/constants/ThemeColorPalette';

interface ThemeColorSelectorProps {
  selectedColor: ThemeColorToken;
  onColorChange: (color: ThemeColorToken) => void;
  disabled?: boolean;
}

export function ThemeColorSelector({
  selectedColor,
  onColorChange,
  disabled = false,
}: ThemeColorSelectorProps) {
  const availableColors = getAvailableThemeColors();
  const textColor = 'fg.muted';

  const getColorPreview = (color: ThemeColorToken) => {
    const colorMap: Record<ThemeColorToken, string> = {
      blue: '#3182ce',
      red: '#e53e3e',
      green: '#38a169',
      purple: '#805ad5',
      orange: '#dd6b20',
      teal: '#319795',
      pink: '#d53f8c',
      cyan: '#00b5d8',
    };
    return colorMap[color];
  };

  return (
    <VStack gap={4} align="start" width="full">
      <Text fontSize="md" fontWeight="medium" color={textColor}>
        Theme Color
      </Text>

      <HStack gap={3} wrap="wrap" width="full">
        {availableColors.map((color) => {
          const isSelected = selectedColor === color;
          const previewColor = getColorPreview(color);

          return (
            <Button
              key={color}
              onClick={() => onColorChange(color)}
              disabled={disabled}
              variant={isSelected ? 'solid' : 'outline'}
              colorPalette={color}
              size="sm"
              width="60px"
              height="40px"
              position="relative"
              aria-label={`Select ${color} theme color`}
              data-selected={isSelected}
              _hover={{
                transform: 'scale(1.05)',
              }}
            >
              <Box
                width="24px"
                height="24px"
                borderRadius="md"
                bg={previewColor}
                border={isSelected ? '2px solid' : '1px solid'}
                borderColor={isSelected ? 'currentColor' : 'border'}
                _after={
                  isSelected
                    ? {
                        content: '""',
                        position: 'absolute',
                        inset: '-4px',
                        border: '2px solid',
                        borderColor: `${color}.200`,
                        borderRadius: 'md',
                      }
                    : undefined
                }
              />
            </Button>
          );
        })}
      </HStack>

      <Text fontSize="sm" color={textColor} opacity={0.7}>
        Select a color to customize your website theme
      </Text>
    </VStack>
  );
}
