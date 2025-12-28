'use client';

import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Spinner,
  Input,
} from '@chakra-ui/react';
import { memo, useState, useEffect, useCallback } from 'react';
import { useColorMode } from '@/presentation/shared/components/ui/color-mode';
import { LoaderBackgroundColor } from '@/domain/settings/value-objects/LoaderBackgroundColor';
import { ColorButton } from './ColorButton';

// Predefined color options with hex values
const LOADER_BACKGROUND_COLOR_OPTIONS: {
  name: string;
  value: string;
  label: string;
}[] = [
  { name: 'white', value: '#FFFFFF', label: 'Blanc' },
  { name: 'black', value: '#000000', label: 'Noir' },
  { name: 'gray-light', value: '#F7FAFC', label: 'Gris clair' },
  { name: 'gray-dark', value: '#1A202C', label: 'Gris foncé' },
  { name: 'blue-light', value: '#EBF8FF', label: 'Bleu clair' },
  { name: 'blue-dark', value: '#1A365D', label: 'Bleu foncé' },
  { name: 'beige', value: '#FFFAF0', label: 'Beige' },
  { name: 'cream', value: '#FDF5E6', label: 'Crème' },
];

interface LoaderBackgroundColorSelectorProps {
  selectedColor: string | null;
  onColorChange: (color: string | null) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const LoaderBackgroundColorSelector = memo<LoaderBackgroundColorSelectorProps>(
  ({ selectedColor, onColorChange, disabled = false, isLoading = false }) => {
    const { colorMode } = useColorMode();
    const textColor = 'fg.muted';
    const [announcement, setAnnouncement] = useState('');
    const [customColor, setCustomColor] = useState('');

    // Get default color based on color mode
    const getDefaultColor = useCallback((): string => {
      return colorMode === 'dark'
        ? LoaderBackgroundColor.getDefaultDark()
        : LoaderBackgroundColor.getDefaultLight();
    }, [colorMode]);

    // Get the effective color (selected or default)
    const getEffectiveColor = useCallback((): string => {
      return selectedColor || getDefaultColor();
    }, [selectedColor, getDefaultColor]);

    // Check if selected color is a predefined one and sync custom color
    useEffect(() => {
      if (selectedColor) {
        const isPredefined = LOADER_BACKGROUND_COLOR_OPTIONS.some(
          (opt) => opt.value.toUpperCase() === selectedColor.toUpperCase()
        );
        if (!isPredefined) {
          setCustomColor(selectedColor);
        } else {
          setCustomColor('');
        }
      } else {
        setCustomColor('');
      }
    }, [selectedColor]);

    // Announce color changes for screen readers
    useEffect(() => {
      if (announcement) {
        const timer = setTimeout(() => setAnnouncement(''), 1000);
        return () => clearTimeout(timer);
      }
    }, [announcement]);

    const handleCustomColorChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomColor(value);
        // Validate hex format and update if valid
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
          onColorChange(value.toUpperCase());
          setAnnouncement(`Couleur de fond du loader changée en ${value}`);
        }
      },
      [onColorChange]
    );

    const handlePredefinedColorClick = useCallback(
      (color: string) => {
        onColorChange(color);
        setCustomColor('');
        const colorOption = LOADER_BACKGROUND_COLOR_OPTIONS.find(
          (opt) => opt.value.toUpperCase() === color.toUpperCase()
        );
        if (colorOption) {
          setAnnouncement(
            `Couleur de fond du loader changée en ${colorOption.label}`
          );
        }
      },
      [onColorChange]
    );

    const handleReset = useCallback(() => {
      onColorChange(null);
      setCustomColor('');
      setAnnouncement('Couleur de fond du loader réinitialisée');
    }, [onColorChange]);

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
            data-testid="loader-background-color-label"
          >
            Couleur de fond du loader
          </Text>
          {isLoading && (
            <Spinner
              size="sm"
              color="fg.muted"
              aria-label="Mise à jour de la couleur de fond du loader"
            />
          )}
        </HStack>

        <HStack gap={3} wrap="wrap" width="full">
          {LOADER_BACKGROUND_COLOR_OPTIONS.map((colorOption) => {
            const isSelected =
              selectedColor?.toUpperCase() === colorOption.value.toUpperCase();

            return (
              <ColorButton
                key={colorOption.name}
                color={colorOption.value}
                label={colorOption.label}
                isSelected={isSelected}
                onClick={() => handlePredefinedColorClick(colorOption.value)}
                disabled={disabled}
                isLoading={isLoading}
              />
            );
          })}
        </HStack>

        {/* Custom color input */}
        <VStack gap={2} align="start" width="full">
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            Couleur personnalisée
          </Text>
          <HStack gap={2}>
            <Input
              type="text"
              value={customColor}
              onChange={handleCustomColorChange}
              placeholder="#000000"
              maxLength={7}
              width="120px"
              size="sm"
              disabled={disabled || isLoading}
              aria-label="Couleur personnalisée au format hexadécimal"
              data-testid="loader-background-color-input"
            />
            <Box
              width="32px"
              height="32px"
              borderRadius="md"
              bg={
                /^#[0-9A-Fa-f]{6}$/.test(customColor)
                  ? customColor
                  : getEffectiveColor()
              }
              border="1px solid"
              borderColor="border.subtle"
            />
          </HStack>
        </VStack>

        {/* Preview */}
        <VStack gap={2} align="start" width="full">
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            Aperçu
          </Text>
          <Box
            data-testid="loader-background-color-preview"
            width="full"
            height="80px"
            borderRadius="md"
            bg={getEffectiveColor()}
            border="1px solid"
            borderColor="border.subtle"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner
              size="lg"
              color={
                getEffectiveColor().toUpperCase() === '#FFFFFF' ||
                getEffectiveColor().toUpperCase() === '#F7FAFC' ||
                getEffectiveColor().toUpperCase() === '#EBF8FF' ||
                getEffectiveColor().toUpperCase() === '#FFFAF0' ||
                getEffectiveColor().toUpperCase() === '#FDF5E6'
                  ? 'gray.600'
                  : 'white'
              }
            />
          </Box>
        </VStack>

        {/* Reset button and status */}
        <HStack gap={4} align="center">
          {selectedColor && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleReset}
              disabled={disabled || isLoading}
              aria-label="Réinitialiser la couleur de fond du loader"
              data-testid="loader-background-color-reset"
            >
              Réinitialiser
            </Button>
          )}
          <Text fontSize="sm" color={textColor} opacity={0.7}>
            {isLoading
              ? 'Mise à jour de la couleur de fond du loader...'
              : selectedColor
                ? `Couleur actuelle: ${selectedColor}`
                : `Couleur par défaut: ${getDefaultColor()}`}
          </Text>
        </HStack>
      </VStack>
    );
  }
);

LoaderBackgroundColorSelector.displayName = 'LoaderBackgroundColorSelector';

export { LoaderBackgroundColorSelector };
