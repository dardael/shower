'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiClock } from 'react-icons/fi';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
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
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        } else {
          setError('Impossible de charger les activités');
        }
      } catch {
        setError('Erreur de connexion');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (isLoading) {
    return (
      <Box p={4}>
        <Text>Chargement des activités...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Box p={4}>
        <Text>Aucune activité disponible pour le moment</Text>
      </Box>
    );
  }

  return (
    <VStack gap={4} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {activities.map((activity) => (
          <Box
            key={activity.id}
            p={4}
            borderRadius="lg"
            bg={selectedActivityId === activity.id ? `${themeColor}.muted` : 'white'}
            _dark={{
              bg: selectedActivityId === activity.id ? `${themeColor}.muted` : 'gray.800',
            }}
            cursor="pointer"
            onClick={() => onSelect(activity)}
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'md',
            }}
            transition="all 0.2s"
            role="button"
            tabIndex={0}
            aria-pressed={selectedActivityId === activity.id}
            aria-label={`Sélectionner l'activité ${activity.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(activity);
              }
            }}
          >
            <VStack align="start" gap={2}>
              <Heading as="h4" size="md" mt={2}>{activity.name}</Heading>
              {activity.description && (
                <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                  {activity.description}
                </Text>
              )}
              <Box display="flex" alignItems="center" gap={2}>
                <Text fontSize="sm" display="flex" alignItems="center">
                  <FiClock />
                </Text>
                <Text fontSize="sm">{activity.durationMinutes} min</Text>
                {activity.price !== undefined && activity.price > 0 && (
                  <Text fontSize="sm" fontWeight="semibold" ml={2}>
                    {activity.price.toFixed(2)} €
                  </Text>
                )}
              </Box>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
}
