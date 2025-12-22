'use client';

import { Box, VStack, HStack, Text, Button, Spinner } from '@chakra-ui/react';
import { memo, useState, useEffect, useRef } from 'react';
import { LuShoppingBag, LuShoppingCart } from 'react-icons/lu';

interface SellingToggleSelectorProps {
  sellingEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

interface ToggleOption {
  value: boolean;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const TOGGLE_OPTIONS: ToggleOption[] = [
  {
    value: false,
    label: 'Désactivé',
    description:
      "Les fonctionnalités produits sont masquées de l'interface admin",
    icon: <LuShoppingCart size={20} />,
  },
  {
    value: true,
    label: 'Activé',
    description:
      "Les fonctionnalités de gestion et d'affichage des produits sont disponibles",
    icon: <LuShoppingBag size={20} />,
  },
];

interface ToggleButtonProps {
  option: ToggleOption;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
  isLoading?: boolean;
}

const ToggleButton = memo<ToggleButtonProps>(
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
        aria-label={`Mode vente ${option.label}`}
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

ToggleButton.displayName = 'ToggleButton';

const SellingToggleSelector = memo<SellingToggleSelectorProps>(
  ({ sellingEnabled, onToggle, disabled = false, isLoading = false }) => {
    const textColor = 'fg.muted';
    const [announcement, setAnnouncement] = useState('');
    const isInitialMount = useRef(true);

    const selectedOption = TOGGLE_OPTIONS.find(
      (opt) => opt.value === sellingEnabled
    );

    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      if (selectedOption) {
        setAnnouncement(`Mode vente changé en ${selectedOption.label}`);
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
            data-testid="selling-toggle-label"
          >
            Mode vente
          </Text>
          {isLoading && (
            <Spinner
              size="sm"
              color="fg.muted"
              aria-label="Mise à jour du mode vente"
            />
          )}
        </HStack>

        <HStack gap={3} wrap="wrap" width="full">
          {TOGGLE_OPTIONS.map((option) => (
            <ToggleButton
              key={option.value.toString()}
              option={option}
              isSelected={sellingEnabled === option.value}
              onClick={() => onToggle(option.value)}
              disabled={disabled}
              isLoading={isLoading}
            />
          ))}
        </HStack>

        <Text fontSize="sm" color={textColor} opacity={0.7}>
          {isLoading
            ? 'Mise à jour du mode vente...'
            : (selectedOption?.description ??
              'Configurez si les fonctionnalités produits sont disponibles')}
        </Text>
      </VStack>
    );
  }
);

SellingToggleSelector.displayName = 'SellingToggleSelector';

export { SellingToggleSelector };
