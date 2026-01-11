'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { FiSave } from 'react-icons/fi';
import { AvailabilityEditor } from './AvailabilityEditor';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import { toaster } from '@/presentation/shared/components/ui/toaster';

interface WeeklySlotData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface ExceptionData {
  date: string;
  reason: string;
}

interface AvailabilityData {
  weeklySlots: WeeklySlotData[];
  exceptions: ExceptionData[];
}

export function AvailabilityEditorContainer(): React.ReactElement {
  const { themeColor } = useThemeColorContext();
  const [weeklySlots, setWeeklySlots] = useState<WeeklySlotData[]>([]);
  const [exceptions, setExceptions] = useState<ExceptionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchAvailability = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/appointments/availability');
      if (response.ok) {
        const data: AvailabilityData = await response.json();
        setWeeklySlots(data.weeklySlots || []);
        setExceptions(
          (data.exceptions || []).map((e) => ({
            date:
              typeof e.date === 'string'
                ? e.date.split('T')[0]
                : new Date(e.date).toISOString().split('T')[0],
            reason: e.reason || '',
          }))
        );
      }
    } catch {
      toaster.error({
        title: 'Erreur',
        description: 'Impossible de charger les disponibilités',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleSlotsChange = (slots: WeeklySlotData[]): void => {
    setWeeklySlots(slots);
    setHasChanges(true);
  };

  const handleExceptionsChange = (newExceptions: ExceptionData[]): void => {
    setExceptions(newExceptions);
    setHasChanges(true);
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/appointments/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weeklySlots,
          exceptions: exceptions.map((e) => ({
            date: new Date(e.date),
            reason: e.reason || undefined,
          })),
        }),
      });

      if (response.ok) {
        toaster.success({
          title: 'Succès',
          description: 'Disponibilités enregistrées',
        });
        setHasChanges(false);
      } else {
        const error = await response.json();
        toaster.error({
          title: 'Erreur',
          description: error.message || 'Impossible de sauvegarder',
        });
      }
    } catch {
      toaster.error({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les disponibilités',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box p={4}>
        <Text>Chargement des disponibilités...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justify="flex-end" mb={4}>
        <Button
          colorPalette={themeColor}
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          loading={isSaving}
        >
          <FiSave />
          Enregistrer
        </Button>
      </Flex>

      <AvailabilityEditor
        weeklySlots={weeklySlots}
        exceptions={exceptions}
        onSlotsChange={handleSlotsChange}
        onExceptionsChange={handleExceptionsChange}
        isLoading={isSaving}
      />
    </Box>
  );
}
