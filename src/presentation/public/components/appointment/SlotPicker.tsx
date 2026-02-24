'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { frontendLog } from '@/infrastructure/shared/services/FrontendLog';
import type { TimeSlot } from '@/presentation/shared/types/appointment';

const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

interface SlotPickerProps {
  activityId: string;
  onSelect: (date: Date, slot: TimeSlot) => void;
  selectedDate?: Date;
  selectedSlot?: TimeSlot;
  themeColor: string;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  // Start on Monday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function SlotPicker({
  activityId,
  onSelect,
  selectedDate,
  selectedSlot,
  themeColor,
}: SlotPickerProps): React.ReactElement {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(today));
  const [selectedDay, setSelectedDay] = useState<Date | null>(selectedDate || null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute the 7 days of current week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  // Compute prev week for navigation
  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const isPrevWeekInPast = false; // Always allow navigation, individual days are marked as past

  const fetchSlots = useCallback(
    async (date: Date): Promise<void> => {
      setIsLoading(true);
      setError(null);
      setSlots([]);
      try {
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const response = await fetch(
          `/api/appointments/availability/slots?activityId=${activityId}&date=${dateStr}`
        );
        if (!response.ok) throw new Error('Impossible de charger les créneaux');
        const data = await response.json();
        setSlots(Array.isArray(data) ? data : (data.slots || []));
      } catch (err) {
        frontendLog.error('Erreur chargement créneaux:', err instanceof Error ? { message: err.message } : { error: err });
        setError('Impossible de charger les créneaux disponibles');
      } finally {
        setIsLoading(false);
      }
    },
    [activityId]
  );

  // Fetch slots for the first non-past day of the week on mount
  useEffect(() => {
    const firstAvailableDay = weekDays.find((d) => d >= today);
    if (firstAvailableDay) {
      setSelectedDay(firstAvailableDay);
      fetchSlots(firstAvailableDay);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial fetch if a date was already selected (e.g., navigating back)
  useEffect(() => {
    if (selectedDate && !weekDays.find((d) => isSameDay(d, selectedDate))) {
      fetchSlots(selectedDate);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDayClick = (day: Date): void => {
    if (day < today) return;
    setSelectedDay(day);
    fetchSlots(day);
  };

  const handlePrevWeek = (): void => {
    setWeekStart((prev) => {
      const newStart = new Date(prev);
      newStart.setDate(newStart.getDate() - 7);
      return newStart;
    });
  };
  const handleNextWeek = (): void => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
  };

  // Always show full date range for the week
  const startMonth = weekDays[0].getMonth();
  const endMonth = weekDays[6].getMonth();
  const monthLabel = `${weekDays[0].getDate()} ${MONTHS_FR[startMonth]} - ${weekDays[6].getDate()} ${MONTHS_FR[endMonth]} ${weekDays[6].getFullYear()}`;

  return (
    <VStack gap={5} align="stretch">
      <Heading as="h3" size="md" fontWeight="semibold">
        Choisissez une date et un créneau
      </Heading>

      {/* Week navigation */}
      <Box
        borderRadius="xl"
        border="1px solid"
        borderColor="whiteAlpha.300"
        bg="whiteAlpha.400"
        _dark={{ borderColor: 'whiteAlpha.100', bg: 'blackAlpha.300' }}
        backdropFilter="blur(12px)"
        style={{ WebkitBackdropFilter: 'blur(12px)' }}
        overflow="hidden"
      >
        {/* Week header */}
        <HStack
          px={4}
          py={3}
          borderBottom="1px solid"
          borderColor="whiteAlpha.200"
          justify="space-between"
        >
          <Button
            variant="ghost"
            size="sm"
            borderRadius="lg"
            onClick={handlePrevWeek}
            disabled={isPrevWeekInPast}
            aria-label="Semaine précédente"
          >
            <FiChevronLeft />
          </Button>
          <span
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            {monthLabel}
          </span>          <Button
            variant="ghost"
            size="sm"
            borderRadius="lg"
            onClick={handleNextWeek}
            aria-label="Semaine suivante"
          >
            <FiChevronRight />
          </Button>
        </HStack>

        {/* Day selector */}
        <Grid templateColumns="repeat(7, 1fr)" gap={0}>
          {weekDays.map((day, idx) => {
            const isPast = day < today;
            const isToday = isSameDay(day, today);
            const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;

            return (
              <Box
                key={idx}
                role="button"
                tabIndex={isPast ? -1 : 0}
                aria-disabled={isPast}
                onClick={() => handleDayClick(day)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !isPast) {
                    e.preventDefault();
                    handleDayClick(day);
                  }
                }}
                cursor={isPast ? 'not-allowed' : 'pointer'}
                py={3}
                px={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
                opacity={isPast ? 0.3 : 1}
                transition="all 0.15s"
                bg={isSelected ? `${themeColor}.solid` : 'transparent'}
                _hover={
                  !isPast && !isSelected
                    ? { bg: `${themeColor}.subtle` }
                    : {}
                }
                borderRight={idx < 6 ? '1px solid' : 'none'}
                borderColor="whiteAlpha.200"
              >
                <Text
                  fontSize={{ base: '9px', md: 'xs' }}
                  fontWeight="medium"
                  color={isSelected ? 'white' : 'fg.muted'}
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  {DAYS_FR[day.getDay()]}
                </Text>
                <Box
                  w={{ base: 7, md: 8 }}
                  h={{ base: 7, md: 8 }}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border={isToday && !isSelected ? '2px solid' : 'none'}
                  borderColor={`${themeColor}.solid`}
                >
                  <Text
                    fontSize={{ base: 'xs', md: 'sm' }}
                    fontWeight={isToday || isSelected ? 'bold' : 'normal'}
                    color={isSelected ? 'white' : isToday ? `${themeColor}.solid` : 'fg'}
                  >
                    {day.getDate()}
                  </Text>
                </Box>
              </Box>
            );
          })}
        </Grid>
      </Box>

      {/* Slots area */}
      {!selectedDay && (
        <Box py={6} textAlign="center">
          <Text color="fg.muted" fontSize="sm">Sélectionnez un jour pour voir les créneaux disponibles.</Text>
        </Box>
      )}

      {selectedDay && (
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={3} color="fg.muted">
            Créneaux disponibles —{' '}
            <Box as="span" color="fg" fontWeight="semibold">
              {selectedDay.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Box>
          </Text>

          {isLoading && (
            <HStack py={8} justify="center" gap={3}>
              <Box
                w={4}
                h={4}
                border="2px solid"
                borderColor={`${themeColor}.solid`}
                borderTopColor="transparent"
                borderRadius="full"
                style={{ animation: 'spin 0.8s linear infinite' }}
                aria-hidden="true"
              />
              <Text fontSize="sm" color="fg.muted">Chargement des créneaux...</Text>
            </HStack>
          )}

          {!isLoading && error && (
            <Box
              py={4}
              px={4}
              borderRadius="xl"
              bg="red.subtle"
              border="1px solid"
              borderColor="red.subtle"
            >
              <Text color="red.solid" fontSize="sm">{error}</Text>
            </Box>
          )}

          {!isLoading && !error && slots.length === 0 && (
            <Box
              py={8}
              textAlign="center"
              borderRadius="xl"
              border="1px dashed"
              borderColor="whiteAlpha.300"
              _dark={{ borderColor: 'whiteAlpha.100' }}
            >
              <Text color="fg.muted" fontSize="sm">Aucun créneau disponible pour cette date</Text>
            </Box>
          )}

          {!isLoading && !error && slots.length > 0 && (
            <Grid
              templateColumns={{
                base: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
              gap={2}
            >
              {slots.map((slot, idx) => {
                const startTime = slot.startTime.substring(11, 16);
                const endTime = slot.endTime.substring(11, 16);
                const isSelectedSlot =
                  selectedSlot?.startTime === slot.startTime;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelect(selectedDay, slot)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem 0.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: 'transparent',
                      border: `1px solid ${isSelectedSlot ? 'var(--chakra-colors-color-palette-solid)' : 'var(--chakra-colors-whiteAlpha-300)'}`,
                      borderRadius: '0.75rem',
                    }}
                    aria-pressed={isSelectedSlot}
                  >
                    <Text
                      fontSize="sm"
                      fontWeight={isSelectedSlot ? 'bold' : 'semibold'}
                      color={isSelectedSlot ? `${themeColor}.solid` : 'fg'}
                    >
                      {startTime} - {endTime}
                    </Text>
                  </button>
                );
              })}
            </Grid>
          )}
        </Box>
      )}
    </VStack>
  );
}
