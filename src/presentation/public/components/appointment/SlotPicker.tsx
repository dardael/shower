'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {
  FRENCH_DAY_NAMES_SHORT,
  FRENCH_MONTH_NAMES,
} from '@/domain/appointment/constants/FrenchLocale';
import { frontendLog } from '@/infrastructure/shared/services/FrontendLog';
import type { TimeSlot } from '@/presentation/shared/types/appointment';

interface SlotPickerProps {
  activityId: string;
  onSelect: (date: Date, slot: TimeSlot) => void;
  selectedDate?: Date;
  selectedSlot?: TimeSlot;
  themeColor: string;
}

export function SlotPicker({
  activityId,
  onSelect,
  selectedDate,
  selectedSlot,
  themeColor,
}: SlotPickerProps): React.ReactElement {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(selectedDate || null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());

  const getWeekDays = (startDate: Date): Date[] => {
    const days: Date[] = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const goToPreviousWeek = (): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = (): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const fetchWeekAvailability = useCallback(async (days: Date[]): Promise<void> => {
    const newAvailableDates = new Set<string>();

    await Promise.all(
      days.map(async (day) => {
        if (isPastDate(day)) return;

        const dateStr = day.toISOString().split('T')[0];
        try {
          const response = await fetch(
            `/api/appointments/availability/slots?activityId=${activityId}&date=${dateStr}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              newAvailableDates.add(dateStr);
            }
          }
        } catch (error) {
          frontendLog.error('Erreur lors de la vérification de disponibilité:', error instanceof Error ? { message: error.message, stack: error.stack } : { error });
        }
      })
    );

    setAvailableDates(newAvailableDates);
  }, [activityId]);

  useEffect(() => {
    if (!selectedDay) return;

    const fetchSlots = async (): Promise<void> => {
      setIsLoadingSlots(true);
      try {
        const dateStr = selectedDay.toISOString().split('T')[0];
        const response = await fetch(
          `/api/appointments/availability/slots?activityId=${activityId}&date=${dateStr}`
        );
        if (response.ok) {
          const data = await response.json();
          setSlots(data);
        } else {
          setSlots([]);
        }
      } catch (error) {
        frontendLog.error('Erreur lors du chargement des créneaux:', error instanceof Error ? { message: error.message, stack: error.stack } : { error });
        setSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [activityId, selectedDay]);

  useEffect(() => {
    fetchWeekAvailability(weekDays);
  }, [fetchWeekAvailability, weekDays]);

  const handleDayClick = (day: Date): void => {
    if (isPastDate(day)) return;
    const dateStr = day.toISOString().split('T')[0];
    if (!availableDates.has(dateStr)) return;
    setSelectedDay(day);
  };

  const handleSlotClick = (slot: TimeSlot): void => {
    if (selectedDay) {
      onSelect(selectedDay, slot);
    }
  };

  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const headerText = `${weekStart.getDate()} ${FRENCH_MONTH_NAMES[weekStart.getMonth()]} - ${weekEnd.getDate()} ${FRENCH_MONTH_NAMES[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  return (
    <VStack gap={4} align="stretch">
      <HStack justify="space-between" align="center">
        <Button
          size="sm"
          variant="ghost"
          onClick={goToPreviousWeek}
          aria-label="Semaine précédente"
        >
          <FiChevronLeft />
        </Button>
        <Text fontWeight="medium">{headerText}</Text>
        <Button
          size="sm"
          variant="ghost"
          onClick={goToNextWeek}
          aria-label="Semaine suivante"
        >
          <FiChevronRight />
        </Button>
      </HStack>

      <SimpleGrid columns={7} gap={2} role="grid" aria-label="Sélection de la date">
        {weekDays.map((day) => {
          const dayLabel = `${FRENCH_DAY_NAMES_SHORT[day.getDay()]} ${day.getDate()} ${FRENCH_MONTH_NAMES[day.getMonth()]}`;
          const isSelected = selectedDay && isSameDay(day, selectedDay);
          const isPast = isPastDate(day);
          const dateStr = day.toISOString().split('T')[0];
          const hasSlots = availableDates.has(dateStr) && !isPast;
          const isDisabled = isPast || !hasSlots;

          return (
            <Box
              key={day.toISOString()}
              p={2}
              textAlign="center"
              borderRadius="md"
              cursor={isDisabled ? 'not-allowed' : 'pointer'}
              opacity={isDisabled ? 0.5 : 1}
              bg={
                isSelected
                  ? `${themeColor}.solid`
                  : isToday(day)
                  ? `${themeColor}.muted`
                  : 'gray.50'
              }
              _dark={{
                bg: isSelected
                  ? `${themeColor}.solid`
                  : isToday(day)
                  ? `${themeColor}.muted`
                  : 'gray.700',
              }}
              color={isSelected ? 'white' : 'inherit'}
              onClick={() => handleDayClick(day)}
              _hover={
                !isDisabled
                  ? {
                      bg: isSelected ? `${themeColor}.solid` : `${themeColor}.muted`,
                      _dark: { bg: `${themeColor}.muted` },
                    }
                  : {}
              }
              role="gridcell"
              aria-label={dayLabel}
              aria-selected={isSelected || false}
              aria-disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
                  e.preventDefault();
                  handleDayClick(day);
                }
              }}
            >
              <Text
                fontSize="xs"
                color={isSelected ? 'white' : 'gray.500'}
              >
                {FRENCH_DAY_NAMES_SHORT[day.getDay()]}
              </Text>
              <Text fontWeight="semibold">
                {day.getDate()}
              </Text>
            </Box>
          );
        })}
      </SimpleGrid>

      {selectedDay && (
        <Box mt={4}>
          <Text fontWeight="medium" mb={2}>
            Créneaux disponibles pour le{' '}
            {selectedDay.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>

          {isLoadingSlots ? (
            <Text>Chargement des créneaux...</Text>
          ) : slots.length === 0 ? (
            <Text color="gray.500">Aucun créneau disponible pour cette date</Text>
          ) : (
            <SimpleGrid columns={{ base: 3, md: 4, lg: 6 }} gap={2}>
              {slots.map((slot) => {
                return (
                  <Button
                    key={`${slot.startTime}-${slot.endTime}`}
                    size="sm"
                    variant={
                      selectedSlot?.startTime === slot.startTime
                        ? 'solid'
                        : 'outline'
                    }
                    colorPalette={
                      selectedSlot?.startTime === slot.startTime
                        ? themeColor
                        : 'gray'
                    }
                    onClick={() => handleSlotClick(slot)}
                    aria-label={`Créneau de ${slot.startTime} à ${slot.endTime}`}
                    aria-pressed={selectedSlot?.startTime === slot.startTime}
                  >
                    {slot.startTime.substring(11, 16)} - {slot.endTime.substring(11, 16)}
                  </Button>
                );
              })}
            </SimpleGrid>
          )}
        </Box>
      )}
    </VStack>
  );
}
