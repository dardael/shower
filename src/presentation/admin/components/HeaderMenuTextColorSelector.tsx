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

// Predefined color options with hex values
const HEADER_TEXT_COLOR_OPTIONS: {
  name: string;
  value: string;
  label: string;
}[] = [
  { name: 'black', value: '#000000', label: 'Noir' },
  { name: 'white', value: '#FFFFFF', label: 'Blanc' },
  { name: 'gray-dark', value: '#374151', label: 'Gris foncé' },
  { name: 'gray-light', value: '#6B7280', label: 'Gris clair' },
  { name: 'gold', value: '#D4AF37', label: 'Or' },
  { name: 'navy', value: '#1E3A5F', label: 'Bleu marine' },
  { name: 'brown', value: '#5D4037', label: 'Marron' },
  { name: 'burgundy', value: '#722F37', label: 'Bordeaux' },
];

interface HeaderMenuTextColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

interface ColorButtonProps {
  color: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
  isLoading?: boolean;
}

// Memoized color button to prevent unnecessary re-renders
const ColorButton = memo<ColorButtonProps>(
  ({ color, label, isSelected, onClick, disabled, isLoading = false }) => {
    // Determine if the color is light to show a border for visibility
    const isLightColor =
      color.toUpperCase() === '#FFFFFF' || color.toUpperCase() === '#FFF';

    return (
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant={isSelected ? 'solid' : 'outline'}
        size="sm"
        width="60px"
        height="40px"
        position="relative"
        aria-label={`Sélectionner la couleur ${label}`}
        data-selected={isSelected}
        opacity={isLoading ? 0.7 : 1}
        title={label}
      >
        {isLoading ? (
          <Spinner size="sm" color="fg.muted" />
        ) : (
          <Box
            width="24px"
            height="24px"
            borderRadius="md"
            bg={color}
            border={isSelected ? '2px solid' : '1px solid'}
            borderColor={
              isLightColor
                ? 'gray.400'
                : isSelected
                  ? 'blue.400'
                  : 'border.subtle'
            }
            _after={
              isSelected
                ? {
                    content: '""',
                    position: 'absolute',
                    inset: '-4px',
                    border: '2px solid',
                    borderColor: 'blue.400',
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

ColorButton.displayName = 'HeaderMenuTextColorButton';

const HeaderMenuTextColorSelector = memo<HeaderMenuTextColorSelectorProps>(
  ({ selectedColor, onColorChange, disabled = false, isLoading = false }) => {
    const textColor = 'fg.muted';
    const [announcement, setAnnouncement] = useState('');
    const [customColor, setCustomColor] = useState('');
    // Check if selected color is a predefined one and sync custom color
    useEffect(() => {
      const isPredefined = HEADER_TEXT_COLOR_OPTIONS.some(
        (opt) => opt.value.toUpperCase() === selectedColor.toUpperCase()
      );
      if (!isPredefined) {
        setCustomColor(selectedColor);
      }
    }, [selectedColor]);

    // Announce color changes for screen readers
    useEffect(() => {
      if (selectedColor) {
        const colorOption = HEADER_TEXT_COLOR_OPTIONS.find(
          (opt) => opt.value.toUpperCase() === selectedColor.toUpperCase()
        );
        const colorName = colorOption ? colorOption.label : selectedColor;
        setAnnouncement(`Couleur du texte du menu changée en ${colorName}`);
        const timer = setTimeout(() => setAnnouncement(''), 1000);
        return () => clearTimeout(timer);
      }
    }, [selectedColor]);

    const handleCustomColorChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomColor(value);
        // Validate hex format and update if valid
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
          onColorChange(value);
        }
      },
      [onColorChange]
    );

    const handlePredefinedColorClick = useCallback(
      (color: string) => {
        onColorChange(color);
      },
      [onColorChange]
    );

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
            data-testid="header-menu-text-color-label"
          >
            Couleur du texte du menu
          </Text>
          {isLoading && (
            <Spinner
              size="sm"
              color="fg.muted"
              aria-label="Mise à jour de la couleur du texte"
            />
          )}
        </HStack>

        <HStack gap={3} wrap="wrap" width="full">
          {HEADER_TEXT_COLOR_OPTIONS.map((colorOption) => {
            const isSelected =
              selectedColor.toUpperCase() === colorOption.value.toUpperCase();

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
            />
            <Box
              width="32px"
              height="32px"
              borderRadius="md"
              bg={
                /^#[0-9A-Fa-f]{6}$/.test(customColor) ? customColor : '#000000'
              }
              border="1px solid"
              borderColor="border.subtle"
            />
          </HStack>
        </VStack>

        {/* Text Color Preview */}
        <VStack gap={2} align="start" width="full">
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            Aperçu
          </Text>
          <Box
            data-testid="header-menu-text-color-preview"
            width="full"
            height="60px"
            borderRadius="md"
            bg="gray.100"
            border="1px solid"
            borderColor="border.subtle"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _dark={{ bg: 'gray.800' }}
          >
            <Text
              fontSize="lg"
              fontWeight="medium"
              style={{ color: selectedColor }}
            >
              Exemple de texte du menu
            </Text>
          </Box>
        </VStack>

        <Text fontSize="sm" color={textColor} opacity={0.7}>
          {isLoading
            ? 'Mise à jour de la couleur du texte...'
            : 'Sélectionnez une couleur pour personnaliser le texte du menu'}
        </Text>
      </VStack>
    );
  }
);

HeaderMenuTextColorSelector.displayName = 'HeaderMenuTextColorSelector';

export { HeaderMenuTextColorSelector };
