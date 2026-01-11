'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
  Badge,
  Spinner,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { ActivityForm } from './ActivityForm';
import { useThemeColor } from '@/presentation/shared/hooks/useThemeColor';
import type { Activity } from '@/presentation/shared/types/appointment';

export function ActivityList(): React.ReactElement {
  const { themeColor } = useThemeColor();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchActivities = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/appointments/activities');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des activités');
      }
      const data = await response.json();
      setActivities(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleDeleteClick = (activity: Activity): void => {
    setActivityToDelete(activity);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!activityToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(
        `/api/appointments/activities/${activityToDelete.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setDeleteConfirmOpen(false);
      setActivityToDelete(null);
      await fetchActivities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = (): void => {
    setDeleteConfirmOpen(false);
    setActivityToDelete(null);
  };

  const handleFormSuccess = (): void => {
    setShowForm(false);
    setEditingActivity(null);
    fetchActivities();
  };

  const handleEdit = (activity: Activity): void => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleAdd = (): void => {
    setEditingActivity(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" />
        <Text mt={2}>Chargement des activités...</Text>
      </Box>
    );
  }

  if (showForm) {
    return (
      <ActivityForm
        activity={editingActivity}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingActivity(null);
        }}
      />
    );
  }

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Activités</Heading>
        <Button colorPalette={themeColor} onClick={handleAdd}>
          <FiPlus />
          <Text ml={2}>Nouvelle activité</Text>
        </Button>
      </HStack>

      {error && (
        <Box
          bg="danger.subtle"
          color="danger.fg"
          p={3}
          borderRadius="md"
          mb={4}
        >
          {error}
        </Box>
      )}

      {activities.length === 0 ? (
        <Box textAlign="center" py={8} color="fg.muted">
          <Text>Aucune activité configurée.</Text>
          <Text>
            Créez votre première activité pour permettre les réservations.
          </Text>
        </Box>
      ) : (
        <VStack gap={4} align="stretch">
          {activities.map((activity) => (
            <Card.Root key={activity.id}>
              <Card.Body>
                <HStack justify="space-between">
                  <HStack gap={4}>
                    <Box w={4} h={4} borderRadius="full" bg={activity.color} />
                    <VStack align="start" gap={1}>
                      <Text fontWeight="bold">{activity.name}</Text>
                      {activity.description && (
                        <Text fontSize="sm" color="fg.muted">
                          {activity.description}
                        </Text>
                      )}
                      <HStack gap={2} flexWrap="wrap">
                        <Badge>{activity.durationMinutes} min</Badge>
                        <Badge>{activity.price} €</Badge>
                        {activity.reminderSettings.enabled && (
                          <Badge>
                            Rappel {activity.reminderSettings.hoursBefore}h
                            avant
                          </Badge>
                        )}
                        {activity.minimumBookingNoticeHours > 0 && (
                          <Badge>
                            Réservation min.{' '}
                            {activity.minimumBookingNoticeHours}h avant
                          </Badge>
                        )}
                      </HStack>
                    </VStack>
                  </HStack>
                  <HStack>
                    <IconButton
                      aria-label="Modifier"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(activity)}
                    >
                      <FiEdit2 />
                    </IconButton>
                    <IconButton
                      aria-label="Supprimer"
                      variant="solid"
                      size="sm"
                      colorPalette="red"
                      onClick={() => handleDeleteClick(activity)}
                    >
                      <FiTrash2 color="white" />
                    </IconButton>
                  </HStack>
                </HStack>
              </Card.Body>
            </Card.Root>
          ))}
        </VStack>
      )}

      <DialogRoot
        open={deleteConfirmOpen}
        onOpenChange={(e) => !e.open && handleDeleteCancel()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody>
            <Text>
              Êtes-vous sûr de vouloir supprimer l&apos;activité{' '}
              <strong>{activityToDelete?.name}</strong> ?
            </Text>
            <Text fontSize="sm" color="fg.muted" mt={2}>
              Cette action est irréversible.
            </Text>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={handleDeleteCancel}>
              Annuler
            </Button>
            <Button
              colorPalette="red"
              onClick={handleDeleteConfirm}
              loading={isDeleting}
              ml={3}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
