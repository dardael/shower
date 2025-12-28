'use client';

import { Box, Button, Spinner } from '@chakra-ui/react';
import { memo } from 'react';

// Common light colors that need a visible border
const LIGHT_COLORS = [
  '#FFFFFF',
  '#FFF',
  '#F7FAFC',
  '#EBF8FF',
  '#FFFAF0',
  '#FDF5E6',
];

export interface ColorButtonProps {
  color: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
  isLoading?: boolean;
}

/**
 * Shared memoized color button component for color selectors.
 * Used by HeaderMenuTextColorSelector and LoaderBackgroundColorSelector.
 */
export const ColorButton = memo<ColorButtonProps>(
  ({ color, label, isSelected, onClick, disabled, isLoading = false }) => {
    // Determine if the color is light to show a border for visibility
    const isLightColor = LIGHT_COLORS.includes(color.toUpperCase());

    return (
      <Button
        type="button"
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

ColorButton.displayName = 'ColorButton';
