'use client';

import { Box, VStack, HStack, Text, Button, Spinner } from '@chakra-ui/react';
import { memo, useState, useEffect } from 'react';
import { LuSun, LuMoon, LuMonitor } from 'react-icons/lu';
import type { ThemeModeValue } from '@/domain/settings/value-objects/ThemeModePreference';

interface ThemeModeSelectorProps {
  selectedMode: ThemeModeValue;
  onModeChange: (mode: ThemeModeValue) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

interface ModeOption {
  value: ThemeModeValue;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const MODE_OPTIONS: ModeOption[] = [
  {
    value: 'user-choice',
    label: 'Choix utilisateur',
    description: 'Les visiteurs peuvent basculer entre le mode clair et sombre',
    icon: <LuMonitor size={20} />,
  },
  {
    value: 'force-light',
    label: 'Forcer clair',
    description: 'Toujours afficher le mode clair, masquer le bouton',
    icon: <LuSun size={20} />,
  },
  {
    value: 'force-dark',
    label: 'Forcer sombre',
    description: 'Toujours afficher le mode sombre, masquer le bouton',
    icon: <LuMoon size={20} />,
  },
];

interface ModeButtonProps {
  option: ModeOption;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
  isLoading?: boolean;
}

const ModeButton = memo<ModeButtonProps>(
  ({ option, isSelected, onClick, disabled, isLoading = false }) => {
    return (
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant={isSelected ? 'solid' : 'outline'}
        size="md"
        height="auto"
        py={3}
        px={4}
        flexDirection="column"
        gap={1}
        minWidth="120px"
        position="relative"
        aria-label={`Sélectionner le mode ${option.label}`}
        aria-pressed={isSelected}
        data-selected={isSelected}
        opacity={isLoading ? 0.7 : 1}
      >
        {isLoading && isSelected ? (
          <Spinner size="sm" color="fg.muted" />
        ) : (
          <>
            <Box color={isSelected ? 'fg.inverted' : 'fg.muted'}>
              {option.icon}
            </Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={isSelected ? 'fg.inverted' : 'fg'}
            >
              {option.label}
            </Text>
          </>
        )}
      </Button>
    );
  }
);

ModeButton.displayName = 'ModeButton';

const ThemeModeSelector = memo<ThemeModeSelectorProps>(
  ({ selectedMode, onModeChange, disabled = false, isLoading = false }) => {
    const textColor = 'fg.muted';
    const [announcement, setAnnouncement] = useState('');

    const selectedOption = MODE_OPTIONS.find(
      (opt) => opt.value === selectedMode
    );

    useEffect(() => {
      if (selectedOption) {
        setAnnouncement(`Mode de thème changé en ${selectedOption.label}`);
        const timer = setTimeout(() => setAnnouncement(''), 1000);
        return () => clearTimeout(timer);
      }
    }, [selectedOption]);

    return (
      <VStack gap={4} align="start" width="full">
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
            data-testid="theme-mode-label"
          >
            Mode du thème
          </Text>
          {isLoading && (
            <Spinner
              size="sm"
              color="fg.muted"
              aria-label="Mise à jour du mode de thème"
            />
          )}
        </HStack>

        <HStack gap={3} wrap="wrap" width="full">
          {MODE_OPTIONS.map((option) => (
            <ModeButton
              key={option.value}
              option={option}
              isSelected={selectedMode === option.value}
              onClick={() => onModeChange(option.value)}
              disabled={disabled}
              isLoading={isLoading}
            />
          ))}
        </HStack>

        <Text fontSize="sm" color={textColor} opacity={0.7}>
          {isLoading
            ? 'Mise à jour du mode de thème...'
            : (selectedOption?.description ??
              'Sélectionnez comment les visiteurs voient le mode clair/sombre')}
        </Text>
      </VStack>
    );
  }
);

ThemeModeSelector.displayName = 'ThemeModeSelector';

export { ThemeModeSelector };
