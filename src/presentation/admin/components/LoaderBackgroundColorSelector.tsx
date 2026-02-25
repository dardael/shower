'use client';

import { Box, VStack, HStack, Text, Button, Spinner } from '@chakra-ui/react';
import { memo, useCallback, useEffect, useState } from 'react';
import { useColorMode } from '@/presentation/shared/components/ui/color-mode';
import { LoaderBackgroundColor } from '@/domain/settings/value-objects/LoaderBackgroundColor';

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

    const getDefaultColor = useCallback((): string => {
      return colorMode === 'dark'
        ? LoaderBackgroundColor.getDefaultDark()
        : LoaderBackgroundColor.getDefaultLight();
    }, [colorMode]);

    const effectiveColor = selectedColor || getDefaultColor();

    useEffect(() => {
      if (announcement) {
        const timer = setTimeout(() => setAnnouncement(''), 1000);
        return () => clearTimeout(timer);
      }
    }, [announcement]);

    const handleColorPickerChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        onColorChange(value);
        setAnnouncement(`Couleur de fond du loader changée en ${value}`);
      },
      [onColorChange]
    );

    const handleReset = useCallback(() => {
      onColorChange(null);
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

        <HStack gap={4} align="center">
          <input
            id="loader-bg-color-picker"
            type="color"
            value={effectiveColor}
            onChange={handleColorPickerChange}
            disabled={disabled || isLoading}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '6px',
              border: '1px solid var(--chakra-colors-border-subtle)',
              padding: '2px',
              cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
              background: 'none',
            }}
            aria-label="Sélectionner la couleur de fond du loader"
            data-testid="loader-background-color-input"
          />
          <Text fontSize="sm" color={textColor}>
            {effectiveColor}
          </Text>
        </HStack>

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
            bg={effectiveColor}
            border="1px solid"
            borderColor="border.subtle"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner size="lg" color="gray.400" />
          </Box>
        </VStack>

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
          {isLoading && (
            <Text fontSize="sm" color={textColor} opacity={0.7}>
              Mise à jour de la couleur de fond du loader...
            </Text>
          )}
        </HStack>
      </VStack>
    );
  }
);

LoaderBackgroundColorSelector.displayName = 'LoaderBackgroundColorSelector';

export { LoaderBackgroundColorSelector };
