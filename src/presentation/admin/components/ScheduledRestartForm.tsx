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
import { LuClock, LuPower, LuPowerOff, LuHistory } from 'react-icons/lu';
import { useScheduledRestart } from '@/presentation/admin/hooks/useScheduledRestart';

const ScheduledRestartForm = memo(() => {
  const {
    enabled,
    restartHour,
    lastRestartAt,
    isLoading,
    isSaving,
    error,
    updateConfig,
  } = useScheduledRestart();

  const [announcement, setAnnouncement] = useState('');
  const [localHour, setLocalHour] = useState(restartHour);
  const textColor = 'fg.muted';
  const isUpdating = isLoading || isSaving;

  // Sync local state when remote data changes
  useEffect(() => {
    setLocalHour(restartHour);
  }, [restartHour]);

  const handleToggleEnabled = useCallback(async () => {
    await updateConfig(!enabled, restartHour);
  }, [enabled, restartHour, updateConfig]);

  const handleHourChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (value === '') {
        setLocalHour(0);
        return;
      }
      const hour = parseInt(value, 10);
      if (!isNaN(hour) && hour >= 0 && hour <= 23) {
        setLocalHour(hour);
      }
    },
    []
  );

  const handleHourBlur = useCallback(async () => {
    if (localHour !== restartHour) {
      await updateConfig(enabled, localHour);
    }
  }, [localHour, restartHour, enabled, updateConfig]);

  useEffect(() => {
    if (enabled) {
      setAnnouncement(
        `Scheduled restart enabled at ${restartHour.toString().padStart(2, '0')}:00`
      );
    } else {
      setAnnouncement('Scheduled restart disabled');
    }
    const timer = setTimeout(() => setAnnouncement(''), 1000);
    return () => clearTimeout(timer);
  }, [enabled, restartHour]);

  const formatLastRestart = (isoDate: string | null): string => {
    if (!isoDate) return 'Jamais';
    const date = new Date(isoDate);
    return date.toLocaleString();
  };

  return (
    <VStack
      gap={6}
      align="start"
      width="full"
      data-testid="scheduled-restart-form"
    >
      {/* Screen reader announcements */}
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

      {/* Last Restart Info */}
      <VStack gap={2} align="start" width="full">
        <HStack gap={2} align="center">
          <LuHistory />
          <Text
            fontSize="md"
            fontWeight="medium"
            color={textColor}
            data-testid="last-restart-label"
          >
            Dernier redémarrage programmé
          </Text>
        </HStack>
        <Text fontSize="sm" color={textColor} data-testid="last-restart-value">
          {formatLastRestart(lastRestartAt)}
        </Text>
      </VStack>

      {/* Enable/Disable Toggle */}
      <VStack gap={3} align="start" width="full">
        <HStack gap={2} align="center">
          <Text
            fontSize="md"
            fontWeight="medium"
            color={textColor}
            data-testid="scheduled-restart-label"
          >
            Redémarrage programmé
          </Text>
          {isUpdating && (
            <Spinner
              size="sm"
              color="fg.muted"
              aria-label="Mise à jour des paramètres de redémarrage"
            />
          )}
        </HStack>

        <HStack gap={3}>
          <Button
            onClick={handleToggleEnabled}
            disabled={isUpdating}
            variant={enabled ? 'solid' : 'outline'}
            colorPalette={enabled ? 'green' : 'gray'}
            size="md"
            aria-label={
              enabled
                ? 'Désactiver le redémarrage programmé'
                : 'Activer le redémarrage programmé'
            }
            aria-pressed={enabled}
            data-testid="toggle-enabled-button"
          >
            <HStack gap={2}>
              {enabled ? <LuPower /> : <LuPowerOff />}
              <Text>{enabled ? 'Activé' : 'Désactivé'}</Text>
            </HStack>
          </Button>
        </HStack>

        <Text fontSize="sm" color={textColor} opacity={0.7}>
          {enabled
            ? "Le serveur redémarrera automatiquement à l'heure configurée chaque jour"
            : 'Activez pour programmer des redémarrages automatiques quotidiens'}
        </Text>
      </VStack>

      {/* Hour Input */}
      {enabled && (
        <VStack gap={3} align="start" width="full">
          <HStack gap={2} align="center">
            <LuClock />
            <Text
              fontSize="md"
              fontWeight="medium"
              color={textColor}
              data-testid="restart-hour-label"
            >
              Heure de redémarrage (0-23)
            </Text>
          </HStack>

          <Input
            type="number"
            min={0}
            max={23}
            value={localHour}
            onChange={handleHourChange}
            onBlur={handleHourBlur}
            disabled={isUpdating}
            width="100px"
            aria-label="Sélectionnez l'heure de redémarrage (0-23)"
            data-testid="restart-hour-input"
          />

          <Text fontSize="sm" color={textColor} opacity={0.7}>
            Actuellement programmé pour redémarrer à{' '}
            <Text as="span" fontWeight="bold">
              {restartHour.toString().padStart(2, '0')}:00
            </Text>{' '}
            heure locale
          </Text>
        </VStack>
      )}

      {/* Error Display */}
      {error && (
        <Box
          p={3}
          borderRadius="md"
          bg="red.100"
          _dark={{ bg: 'red.900' }}
          width="full"
        >
          <Text color="red.600" _dark={{ color: 'red.200' }} fontSize="sm">
            {error}
          </Text>
        </Box>
      )}
    </VStack>
  );
});

ScheduledRestartForm.displayName = 'ScheduledRestartForm';

export { ScheduledRestartForm };
