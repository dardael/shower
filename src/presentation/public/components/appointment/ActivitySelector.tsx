'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  HStack,
  Text,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { FiClock, FiDollarSign, FiChevronRight } from 'react-icons/fi';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import { frontendLog } from '@/infrastructure/shared/services/FrontendLog';
import type { Activity } from '@/presentation/shared/types/appointment';

interface ActivitySelectorProps {
  onSelect: (activity: Activity) => void;
  selectedActivityId?: string;
}

export function ActivitySelector({
  onSelect,
  selectedActivityId,
}: ActivitySelectorProps): React.ReactElement {
  const { themeColor } = useThemeColorContext();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async (): Promise<void> => {
      try {
        const response = await fetch('/api/appointments/activities/public');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setActivities(Array.isArray(data) ? data : (data.activities || []));
      } catch (err) {
        frontendLog.error('Erreur chargement activités:', err instanceof Error ? { message: err.message } : { error: err });
        const message = err instanceof Error && err.message.startsWith('HTTP')
          ? 'Impossible de charger les activités'
          : 'Erreur de connexion';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (isLoading) {
    return (
      <VStack py={12} gap={3} align="center">
        <Spinner color={`${themeColor}.solid`} size="lg" />
        <Text color="fg.muted" fontSize="sm">Chargement des activités...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Box
        py={8}
        px={4}
        textAlign="center"
        borderRadius="xl"
        bg="red.subtle"
        border="1px solid"
        borderColor="red.subtle"
      >
        <Text color="red.solid" fontWeight="medium">{error}</Text>
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Box py={8} textAlign="center">
        <Text color="fg.muted">Aucune activité disponible pour le moment</Text>
      </Box>
    );
  }

  return (
    <VStack gap={5} align="stretch">

      <Grid
        templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }}
        gap={3}
      >
        {activities.map((activity) => {
          const isSelected = activity.id === selectedActivityId;
          const accentColor = activity.color || `var(--chakra-colors-${themeColor}-solid)`;

          return (
            <Box
              key={activity.id}
              role="button"
              tabIndex={0}
              aria-label={`Sélectionner ${activity.name}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(activity)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(activity);
                }
              }}
              cursor="pointer"
              borderRadius="xl"
              border="1px solid"
              borderColor={isSelected ? `${themeColor}.solid` : 'whiteAlpha.300'}
              bg={isSelected ? `${themeColor}.subtle` : 'whiteAlpha.400'}
              _dark={{
                borderColor: isSelected ? `${themeColor}.solid` : 'whiteAlpha.100',
                bg: isSelected ? `${themeColor}.subtle` : 'blackAlpha.300',
              }}
              backdropFilter="blur(12px)"
              style={{ WebkitBackdropFilter: 'blur(12px)' }}
              p={4}
              transition="all 0.2s ease"
              _hover={{
                borderColor: `${themeColor}.solid`,
                bg: `${themeColor}.subtle`,
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              position="relative"
              overflow="hidden"
            >
              {/* Color band */}
              <Box
                position="absolute"
                top={0}
                left={0}
                w="4px"
                h="full"
                bg={accentColor}
                borderRadius="xl 0 0 xl"
              />

              <VStack align="start" gap={2} pl={3}>
                <HStack justify="space-between" w="full">
                  <Text fontWeight="400" letterSpacing="0.01em" fontSize="sm" lineClamp={2}>
                    {activity.name}
                  </Text>
                  <FiChevronRight
                    color={isSelected ? `var(--chakra-colors-${themeColor}-solid)` : 'var(--chakra-colors-fg-muted)'}
                    size={16}
                  />
                </HStack>

                {activity.description && (
                  <Text fontSize="xs" color="fg.muted" lineClamp={2}>
                    {activity.description}
                  </Text>
                )}

                <HStack gap={3} mt={1}>
                  <HStack gap={1} color="fg.muted" alignItems="center">
                    <Box display="flex" alignItems="center"><FiClock size={12} /></Box>
                    <span style={{ fontSize: '0.75rem' }}>{activity.durationMinutes} min</span>
                  </HStack>
                  {activity.price !== undefined && activity.price > 0 && (
                    <HStack gap={1} color="fg.muted" alignItems="center">
                      <Box display="flex" alignItems="center"><FiDollarSign size={12} /></Box>
                      <span style={{ fontSize: '0.75rem' }}>{activity.price.toFixed(2)} €</span>
                    </HStack>
                  )}
                </HStack>
              </VStack>
            </Box>
          );
        })}
      </Grid>
    </VStack>
  );
}
