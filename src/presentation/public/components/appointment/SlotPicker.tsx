'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Grid,
  HStack,
  Text,
  VStack,
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
  const [availableDays, setAvailableDays] = useState<Set<string>>(new Set());
  const [isDaysLoading, setIsDaysLoading] = useState(false);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const isPrevWeekInPast = false;

  function toDateString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  const fetchAvailableDays = useCallback(
    async (weekStartDate: Date): Promise<void> => {
      setIsDaysLoading(true);
      try {
        const weekStartStr = toDateString(weekStartDate);
        const response = await fetch(
          `/api/appointments/availability/days?activityId=${activityId}&weekStart=${weekStartStr}`
        );
        if (!response.ok) throw new Error('Impossible de charger les jours disponibles');
        const data: string[] = await response.json();
        setAvailableDays(new Set(data));
      } catch (err) {
        frontendLog.error('Erreur chargement jours disponibles:', err instanceof Error ? { message: err.message } : { error: err });
        setAvailableDays(new Set());
      } finally {
        setIsDaysLoading(false);
      }
    },
    [activityId]
  );

  const fetchSlots = useCallback(
    async (date: Date): Promise<void> => {
      setIsLoading(true);
      setError(null);
      setSlots([]);
      try {
        const dateStr = toDateString(date);
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

  useEffect(() => {
    fetchAvailableDays(weekStart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart, activityId]);

  useEffect(() => {
    const firstAvailableDay = weekDays.find((d) => d >= today);
    if (firstAvailableDay) {
      setSelectedDay(firstAvailableDay);
      fetchSlots(firstAvailableDay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedDate && !weekDays.find((d) => isSameDay(d, selectedDate))) {
      fetchSlots(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDayDisabled = (day: Date): boolean => {
    if (day < today) return true;
    if (isDaysLoading) return true;
    return !availableDays.has(toDateString(day));
  };

  const handleDayClick = (day: Date): void => {
    if (isDayDisabled(day)) return;
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

  const startMonth = weekDays[0].getMonth();
  const endMonth = weekDays[6].getMonth();
  const monthLabel = `${weekDays[0].getDate()} ${MONTHS_FR[startMonth]} - ${weekDays[6].getDate()} ${MONTHS_FR[endMonth]} ${weekDays[6].getFullYear()}`;

  return (
    <VStack gap={5} align="stretch">

      {/* Week navigation — glassmorphisme comme les activity cards */}
      <Box
        borderRadius="xl"
        border="1px solid"
        borderColor="whiteAlpha.300"
        bg="whiteAlpha.400"
        _dark={{ borderColor: 'whiteAlpha.100', bg: 'blackAlpha.300' }}
        backdropFilter="blur(12px)"
        style={{ WebkitBackdropFilter: 'blur(12px)' }}
        overflow="hidden"
        boxShadow="0 4px 16px rgba(0,0,0,0.06)"
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
            borderRadius="full"
            border="1px solid"
            borderColor={{ base: 'rgba(0,0,0,0.1)', _dark: 'rgba(255,255,255,0.15)' }}
            bg={{ base: 'rgba(255,255,255,0.5)', _dark: 'rgba(255,255,255,0.06)' }}
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={handlePrevWeek}
            disabled={isPrevWeekInPast}
            aria-label="Semaine précédente"
            _hover={{
              bg: { base: 'rgba(255,255,255,0.85)', _dark: 'rgba(255,255,255,0.12)' },
              borderColor: { base: 'rgba(0,0,0,0.2)', _dark: 'rgba(255,255,255,0.25)' },
            }}
          >
            <FiChevronLeft />
          </Button>
          <span style={{ fontSize: '14px', fontWeight: 400, letterSpacing: '0.05em' }}>
            {monthLabel}
          </span>
          <Button
            variant="ghost"
            size="sm"
            borderRadius="full"
            border="1px solid"
            borderColor={{ base: 'rgba(0,0,0,0.1)', _dark: 'rgba(255,255,255,0.15)' }}
            bg={{ base: 'rgba(255,255,255,0.5)', _dark: 'rgba(255,255,255,0.06)' }}
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={handleNextWeek}
            aria-label="Semaine suivante"
            _hover={{
              bg: { base: 'rgba(255,255,255,0.85)', _dark: 'rgba(255,255,255,0.12)' },
              borderColor: { base: 'rgba(0,0,0,0.2)', _dark: 'rgba(255,255,255,0.25)' },
            }}
          >
            <FiChevronRight />
          </Button>
        </HStack>

        {/* Day selector */}
        <Grid templateColumns="repeat(7, 1fr)" gap={0}>
          {weekDays.map((day, idx) => {
            const disabled = isDayDisabled(day);
            const isToday = isSameDay(day, today);
            const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;

            return (
              <Box
                key={idx}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
                onClick={() => handleDayClick(day)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                    e.preventDefault();
                    handleDayClick(day);
                  }
                }}
                cursor={disabled ? 'not-allowed' : 'pointer'}
                py={3}
                px={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
                opacity={disabled ? 0.3 : 1}
                transition="all 0.15s"
                bg={isSelected ? `${themeColor}.solid` : 'transparent'}
                _hover={
                  !disabled && !isSelected
                    ? { bg: `${themeColor}.subtle` }
                    : {}
                }
                borderRight={idx < 6 ? '1px solid' : 'none'}
                borderColor="whiteAlpha.200"
              >
                {/* Day name */}
                <span style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: isSelected ? 'white' : 'var(--chakra-colors-fg-muted)',
                }}>
                  {DAYS_FR[day.getDay()]}
                </span>

                {/* Day number circle */}
                <Box
                  w={{ base: 7, md: 8 }}
                  h={{ base: 7, md: 8 }}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border={isToday && !isSelected ? '2px solid' : 'none'}
                  borderColor={`${themeColor}.solid`}
                  flexShrink={0}
                >
                  <span style={{
                    fontSize: '13px',
                    fontWeight: isToday || isSelected ? 700 : 400,
                    color: isSelected ? 'white' : isToday ? `var(--chakra-colors-${themeColor}-solid)` : 'inherit',
                    lineHeight: 1,
                  }}>
                    {day.getDate()}
                  </span>
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
          <Text fontSize="sm" fontWeight="400" letterSpacing="0.01em" mb={3} color="fg.muted">
            Créneaux disponibles —{' '}
            <Box as="span" color="fg" fontWeight="400">
              {selectedDay.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Box>
          </Text>

          {/* Loader aligné */}
          {isLoading && (
            <HStack py={8} justify="center" gap={3} alignItems="center">
              <Box
                w={4}
                h={4}
                border="2px solid"
                borderColor={`${themeColor}.solid`}
                borderTopColor="transparent"
                borderRadius="full"
                flexShrink={0}
                style={{ animation: 'spin 0.8s linear infinite' }}
                aria-hidden="true"
              />
              <span style={{ fontSize: '0.875rem', color: 'var(--chakra-colors-fg-muted)' }}>
                Chargement des créneaux...
              </span>
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

          {/* Créneaux — style glassmorphisme comme les activity cards */}
          {!isLoading && !error && slots.length > 0 && (
            <Grid
              templateColumns={{
                base: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
              gap={3}
            >
              {slots.map((slot, idx) => {
                const startTime = slot.startTime.substring(11, 16);
                const endTime = slot.endTime.substring(11, 16);
                const isSelectedSlot = selectedSlot?.startTime === slot.startTime;

                return (
                  <Box
                    key={idx}
                    as="button"
                    onClick={() => onSelect(selectedDay, slot)}
                    aria-pressed={isSelectedSlot}
                    position="relative"
                    overflow="hidden"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={isSelectedSlot ? `${themeColor}.solid` : 'whiteAlpha.300'}
                    bg={isSelectedSlot ? `${themeColor}.subtle` : 'whiteAlpha.400'}
                    backdropFilter="blur(12px)"
                    style={{ WebkitBackdropFilter: 'blur(12px)' }}
                    _dark={{
                      borderColor: isSelectedSlot ? `${themeColor}.solid` : 'whiteAlpha.100',
                      bg: isSelectedSlot ? `${themeColor}.subtle` : 'blackAlpha.300',
                    }}
                    _hover={{
                      borderColor: `${themeColor}.solid`,
                      bg: `${themeColor}.subtle`,
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.15s"
                    cursor="pointer"
                    py={3}
                    px={2}
                    w="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="0 2px 8px rgba(0,0,0,0.05)"
                  >
                    {/* Accent bar */}
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      w="3px"
                      h="full"
                      bg={isSelectedSlot ? `${themeColor}.solid` : `${themeColor}.muted`}
                      borderRadius="xl 0 0 xl"
                      opacity={isSelectedSlot ? 1 : 0.4}
                    />
                    <span style={{
                      fontSize: '0.8125rem',
                      fontWeight: 400,
                      letterSpacing: '0.01em',
                      color: isSelectedSlot ? `var(--chakra-colors-${themeColor}-solid)` : 'inherit',
                    }}>
                      {startTime} - {endTime}
                    </span>
                  </Box>
                );
              })}
            </Grid>
          )}
        </Box>
      )}
    </VStack>
  );
}
