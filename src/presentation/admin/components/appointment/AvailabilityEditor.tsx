'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { FRENCH_DAY_NAMES } from '@/domain/appointment/constants/FrenchLocale';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';

const NATIVE_SELECT_STYLES = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid var(--chakra-colors-gray-200)',
  minWidth: '140px',
  backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
  color: 'var(--chakra-colors-chakra-body-text)',
} as const;

interface WeeklySlotData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface ExceptionData {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  reason: string;
}

interface AvailabilityEditorProps {
  weeklySlots: WeeklySlotData[];
  exceptions: ExceptionData[];
  onSlotsChange: (slots: WeeklySlotData[]) => void;
  onExceptionsChange: (exceptions: ExceptionData[]) => void;
  isLoading?: boolean;
}

function formatDateFr(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatException(exception: ExceptionData): string {
  const isSingleDay = exception.startDate === exception.endDate;
  const hasTime = exception.startTime && exception.endTime;

  const dateLabel = isSingleDay
    ? formatDateFr(exception.startDate)
    : `du ${formatDateFr(exception.startDate)} au ${formatDateFr(exception.endDate)}`;

  if (hasTime) {
    return `${dateLabel} · ${exception.startTime} – ${exception.endTime}`;
  }

  return dateLabel;
}

export function AvailabilityEditor({
  weeklySlots,
  exceptions,
  onSlotsChange,
  onExceptionsChange,
  isLoading = false,
}: AvailabilityEditorProps): React.ReactElement {
  const { themeColor } = useThemeColorContext();

  const [newSlot, setNewSlot] = useState<WeeklySlotData>({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
  });
  const [newException, setNewException] = useState<ExceptionData>({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    reason: '',
  });
  const [slotError, setSlotError] = useState<string>('');
  const [exceptionError, setExceptionError] = useState<string>('');

  const handleAddSlot = (): void => {
    setSlotError('');

    if (newSlot.endTime <= newSlot.startTime) {
      setSlotError("L'heure de fin doit être après l'heure de début");
      return;
    }

    const hasOverlap = weeklySlots.some(
      (slot) =>
        slot.dayOfWeek === newSlot.dayOfWeek &&
        slot.startTime < newSlot.endTime &&
        newSlot.startTime < slot.endTime
    );

    if (hasOverlap) {
      setSlotError('Ce créneau chevauche un créneau existant');
      return;
    }

    onSlotsChange([...weeklySlots, { ...newSlot }]);
  };

  const handleRemoveSlot = (slotToRemove: WeeklySlotData): void => {
    onSlotsChange(
      weeklySlots.filter(
        (slot) =>
          !(
            slot.dayOfWeek === slotToRemove.dayOfWeek &&
            slot.startTime === slotToRemove.startTime &&
            slot.endTime === slotToRemove.endTime
          )
      )
    );
  };

  const handleAddException = (): void => {
    setExceptionError('');

    if (!newException.startDate) {
      setExceptionError('Une date de début est requise');
      return;
    }

    const endDate = newException.endDate || newException.startDate;

    if (endDate < newException.startDate) {
      setExceptionError('La date de fin doit être après la date de début');
      return;
    }

    const hasTime = !!(newException.startTime && newException.endTime);
    if (hasTime && newException.endTime <= newException.startTime) {
      setExceptionError("L'heure de fin doit être après l'heure de début");
      return;
    }

    if (
      (newException.startTime && !newException.endTime) ||
      (!newException.startTime && newException.endTime)
    ) {
      setExceptionError(
        "L'heure de début et l'heure de fin doivent être fournies ensemble"
      );
      return;
    }

    const exception: ExceptionData = {
      startDate: newException.startDate,
      endDate: endDate,
      startTime: newException.startTime,
      endTime: newException.endTime,
      reason: newException.reason,
    };

    onExceptionsChange([...exceptions, exception]);
    setNewException({
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      reason: '',
    });
  };

  const handleRemoveException = (index: number): void => {
    onExceptionsChange(exceptions.filter((_, i) => i !== index));
  };

  const sortedSlots = [...weeklySlots].sort((a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
    return a.startTime.localeCompare(b.startTime);
  });

  const sortedExceptions = exceptions
    .map((e, i) => ({ ...e, originalIndex: i }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <VStack gap={6} align="stretch">
      {/* Créneaux hebdomadaires */}
      <Box>
        <Heading size="md" mb={4}>
          Créneaux hebdomadaires
        </Heading>

        <VStack gap={3} align="stretch" mb={4}>
          {sortedSlots.length === 0 ? (
            <Text color="gray.500">Aucun créneau défini</Text>
          ) : (
            sortedSlots.map((slot) => (
              <Flex
                key={`${slot.dayOfWeek}-${slot.startTime}-${slot.endTime}`}
                align="center"
                justify="space-between"
                p={3}
                borderWidth={1}
                borderRadius="md"
              >
                <HStack gap={4}>
                  <Text fontWeight="medium" minW="100px">
                    {FRENCH_DAY_NAMES[slot.dayOfWeek]}
                  </Text>
                  <Text>
                    {slot.startTime} – {slot.endTime}
                  </Text>
                </HStack>
                <IconButton
                  aria-label="Supprimer le créneau"
                  size="sm"
                  colorPalette="red"
                  variant="solid"
                  onClick={() => handleRemoveSlot(slot)}
                  disabled={isLoading}
                >
                  <FiTrash2 color="white" />
                </IconButton>
              </Flex>
            ))
          )}
        </VStack>

        <Box
          p={4}
          borderWidth={1}
          borderRadius="md"
          bg="gray.50"
          _dark={{ bg: 'gray.800' }}
        >
          <Text fontWeight="medium" mb={3}>
            Ajouter un créneau
          </Text>
          <Flex gap={3} wrap="wrap" align="flex-end">
            <Box>
              <Text fontSize="sm" mb={1}>
                Jour
              </Text>
              <select
                value={newSlot.dayOfWeek}
                onChange={(e) =>
                  setNewSlot({
                    ...newSlot,
                    dayOfWeek: parseInt(e.target.value),
                  })
                }
                disabled={isLoading}
                style={NATIVE_SELECT_STYLES}
              >
                {Object.entries(FRENCH_DAY_NAMES).map(([index, name]) => (
                  <option key={index} value={index}>
                    {name}
                  </option>
                ))}
              </select>
            </Box>
            <Box>
              <Text fontSize="sm" mb={1}>
                Début
              </Text>
              <Input
                type="time"
                value={newSlot.startTime}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, startTime: e.target.value })
                }
                disabled={isLoading}
                size="sm"
                width="120px"
              />
            </Box>
            <Box>
              <Text fontSize="sm" mb={1}>
                Fin
              </Text>
              <Input
                type="time"
                value={newSlot.endTime}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, endTime: e.target.value })
                }
                disabled={isLoading}
                size="sm"
                width="120px"
              />
            </Box>
            <Button
              colorPalette={themeColor}
              size="sm"
              onClick={handleAddSlot}
              disabled={isLoading}
            >
              <FiPlus />
              Ajouter
            </Button>
          </Flex>
          {slotError && (
            <Text color="danger.fg" fontSize="sm" mt={2}>
              {slotError}
            </Text>
          )}
        </Box>
      </Box>

      {/* Exceptions */}
      <Box>
        <Heading size="md" mb={1}>
          Exceptions
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>
          Définissez les périodes où vous n&apos;êtes pas disponible (journées
          entières ou plages horaires).
        </Text>

        <VStack gap={3} align="stretch" mb={4}>
          {sortedExceptions.length === 0 ? (
            <Text color="gray.500">Aucune exception définie</Text>
          ) : (
            sortedExceptions.map((exception) => (
              <Flex
                key={`${exception.startDate}-${exception.endDate}-${exception.startTime}-${exception.endTime}`}
                align="center"
                justify="space-between"
                p={3}
                borderWidth={1}
                borderRadius="md"
              >
                <VStack align="start" gap={0}>
                  <Text fontWeight="medium">{formatException(exception)}</Text>
                  {exception.reason && (
                    <Text fontSize="sm" color="gray.500">
                      {exception.reason}
                    </Text>
                  )}
                </VStack>
                <IconButton
                  aria-label="Supprimer l'exception"
                  size="sm"
                  colorPalette="red"
                  variant="solid"
                  onClick={() => handleRemoveException(exception.originalIndex)}
                  disabled={isLoading}
                >
                  <FiTrash2 color="white" />
                </IconButton>
              </Flex>
            ))
          )}
        </VStack>

        <Box
          p={4}
          borderWidth={1}
          borderRadius="md"
          bg="gray.50"
          _dark={{ bg: 'gray.800' }}
        >
          <Text fontWeight="medium" mb={3}>
            Ajouter une exception
          </Text>
          <Flex gap={3} wrap="wrap" align="flex-end">
            <Box>
              <Text fontSize="sm" mb={1}>
                Date de début
              </Text>
              <Input
                type="date"
                value={newException.startDate}
                onChange={(e) =>
                  setNewException({
                    ...newException,
                    startDate: e.target.value,
                  })
                }
                disabled={isLoading}
                size="sm"
                width="160px"
              />
            </Box>
            <Box>
              <Text fontSize="sm" mb={1}>
                Date de fin
              </Text>
              <Input
                type="date"
                value={newException.endDate}
                min={newException.startDate}
                onChange={(e) =>
                  setNewException({ ...newException, endDate: e.target.value })
                }
                disabled={isLoading}
                size="sm"
                width="160px"
              />
            </Box>
            <Box>
              <Text fontSize="sm" mb={1}>
                Heure de début (optionnel)
              </Text>
              <Input
                type="time"
                value={newException.startTime}
                onChange={(e) =>
                  setNewException({
                    ...newException,
                    startTime: e.target.value,
                  })
                }
                disabled={isLoading}
                size="sm"
                width="120px"
              />
            </Box>
            <Box>
              <Text fontSize="sm" mb={1}>
                Heure de fin (optionnel)
              </Text>
              <Input
                type="time"
                value={newException.endTime}
                onChange={(e) =>
                  setNewException({ ...newException, endTime: e.target.value })
                }
                disabled={isLoading}
                size="sm"
                width="120px"
              />
            </Box>
            <Box>
              <Text fontSize="sm" mb={1}>
                Raison (optionnel)
              </Text>
              <Input
                type="text"
                value={newException.reason}
                onChange={(e) =>
                  setNewException({ ...newException, reason: e.target.value })
                }
                placeholder="Ex: Congés, Réunion…"
                disabled={isLoading}
                size="sm"
                width="200px"
              />
            </Box>
            <Button
              colorPalette={themeColor}
              size="sm"
              onClick={handleAddException}
              disabled={isLoading}
            >
              <FiPlus />
              Ajouter
            </Button>
          </Flex>
          {exceptionError && (
            <Text color="danger.fg" fontSize="sm" mt={2}>
              {exceptionError}
            </Text>
          )}
        </Box>
      </Box>
    </VStack>
  );
}
