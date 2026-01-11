'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Badge,
  Box,
  Button,
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  Flex,
  HStack,
  IconButton,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiCheck, FiX, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { toaster } from '@/presentation/shared/components/ui/toaster';
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS,
} from '@/presentation/shared/utils/appointmentStatus';
import { formatAppointmentDateTime } from '@/presentation/shared/utils/formatDate';

interface Appointment {
  id: string;
  activityName: string;
  activityColor: string;
  dateTime: string;
  durationMinutes: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  clientInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    customField?: string;
  };
}

export function AppointmentList(): React.ReactElement {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null
  );

  const fetchAppointments = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        toaster.error({
          title: 'Erreur',
          description: 'Impossible de charger les rendez-vous',
        });
      }
    } catch {
      toaster.error({
        title: 'Erreur',
        description: 'Erreur de connexion',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleConfirm = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm' }),
      });

      if (response.ok) {
        toaster.success({
          title: 'Succès',
          description: 'Rendez-vous confirmé',
        });
        fetchAppointments();
      } else {
        const error = await response.json();
        toaster.error({
          title: 'Erreur',
          description:
            error.message || 'Impossible de confirmer le rendez-vous',
        });
      }
    } catch {
      toaster.error({
        title: 'Erreur',
        description: 'Erreur de connexion',
      });
    }
  };

  const handleCancel = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      });

      if (response.ok) {
        toaster.success({
          title: 'Succès',
          description: 'Rendez-vous annulé',
        });
        fetchAppointments();
      } else {
        const error = await response.json();
        toaster.error({
          title: 'Erreur',
          description: error.message || "Impossible d'annuler le rendez-vous",
        });
      }
    } catch {
      toaster.error({
        title: 'Erreur',
        description: 'Erreur de connexion',
      });
    }
  };

  const handleDeleteClick = (id: string): void => {
    setAppointmentToDelete(id);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!appointmentToDelete) return;

    try {
      const response = await fetch(`/api/appointments/${appointmentToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toaster.success({
          title: 'Succès',
          description: 'Rendez-vous supprimé',
        });
        fetchAppointments();
      } else {
        toaster.error({
          title: 'Erreur',
          description: 'Impossible de supprimer le rendez-vous',
        });
      }
    } catch {
      toaster.error({
        title: 'Erreur',
        description: 'Erreur de connexion',
      });
    } finally {
      setAppointmentToDelete(null);
    }
  };

  const handleDeleteCancel = (): void => {
    setAppointmentToDelete(null);
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const sortedAppointments = [...filteredAppointments].sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );

  if (isLoading) {
    return (
      <Box p={4}>
        <Text>Chargement des rendez-vous...</Text>
      </Box>
    );
  }

  return (
    <>
      <VStack gap={4} align="stretch">
        <Flex justify="space-between" align="center">
          <HStack gap={2}>
            <Button
              size="sm"
              variant={filter === 'all' ? 'solid' : 'outline'}
              onClick={() => setFilter('all')}
              color={filter === 'all' ? 'fg' : undefined}
            >
              Tous ({appointments.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'pending' ? 'solid' : 'outline'}
              colorPalette="yellow"
              onClick={() => setFilter('pending')}
              color={filter === 'pending' ? 'white' : 'black'}
              _dark={{ color: filter === 'pending' ? 'white' : 'yellow.200' }}
            >
              En attente (
              {appointments.filter((a) => a.status === 'pending').length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'confirmed' ? 'solid' : 'outline'}
              colorPalette="green"
              onClick={() => setFilter('confirmed')}
              color={filter === 'confirmed' ? 'white' : 'black'}
              _dark={{ color: filter === 'confirmed' ? 'white' : 'green.200' }}
            >
              Confirmés (
              {appointments.filter((a) => a.status === 'confirmed').length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'cancelled' ? 'solid' : 'outline'}
              colorPalette="gray"
              onClick={() => setFilter('cancelled')}
              color={filter === 'cancelled' ? 'white' : 'black'}
              _dark={{ color: filter === 'cancelled' ? 'white' : 'gray.200' }}
            >
              Annulés (
              {appointments.filter((a) => a.status === 'cancelled').length})
            </Button>
          </HStack>
          <IconButton
            aria-label="Actualiser"
            size="sm"
            variant="ghost"
            onClick={fetchAppointments}
          >
            <FiRefreshCw />
          </IconButton>
        </Flex>

        {sortedAppointments.length === 0 ? (
          <Box p={8} textAlign="center">
            <Text color="gray.500">Aucun rendez-vous à afficher</Text>
          </Box>
        ) : (
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Date/Heure</Table.ColumnHeader>
                <Table.ColumnHeader>Activité</Table.ColumnHeader>
                <Table.ColumnHeader>Client</Table.ColumnHeader>
                <Table.ColumnHeader>Statut</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sortedAppointments.map((appointment) => (
                <Table.Row key={appointment.id}>
                  <Table.Cell>
                    <Text fontWeight="medium">
                      {formatAppointmentDateTime(appointment.dateTime)}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {appointment.durationMinutes} min
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <HStack gap={2}>
                      <Box
                        w={3}
                        h={3}
                        borderRadius="full"
                        bg={appointment.activityColor}
                      />
                      <Text>{appointment.activityName}</Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="medium">
                        {appointment.clientInfo.name}
                      </Text>
                      <Text fontSize="xs" color="fg.muted">
                        {appointment.clientInfo.email}
                      </Text>
                      {appointment.clientInfo.phone && (
                        <Text fontSize="xs" color="fg.muted">
                          {appointment.clientInfo.phone}
                        </Text>
                      )}
                      {appointment.clientInfo.address && (
                        <Text fontSize="xs" color="fg.muted">
                          {appointment.clientInfo.address}
                        </Text>
                      )}
                      {appointment.clientInfo.customField && (
                        <Text fontSize="xs" color="fg.muted">
                          {appointment.clientInfo.customField}
                        </Text>
                      )}
                    </VStack>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={
                        APPOINTMENT_STATUS_COLORS[appointment.status]
                      }
                      color="black"
                      _dark={{ color: 'white' }}
                    >
                      {APPOINTMENT_STATUS_LABELS[appointment.status]}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <HStack gap={1}>
                      {appointment.status === 'pending' && (
                        <>
                          <IconButton
                            aria-label="Confirmer"
                            size="xs"
                            colorPalette="green"
                            variant="outline"
                            onClick={() => handleConfirm(appointment.id)}
                            color="black"
                            _dark={{ color: 'green.200' }}
                          >
                            <FiCheck />
                          </IconButton>
                          <IconButton
                            aria-label="Annuler"
                            size="xs"
                            colorPalette="orange"
                            variant="outline"
                            onClick={() => handleCancel(appointment.id)}
                            color="black"
                            _dark={{ color: 'orange.200' }}
                          >
                            <FiX />
                          </IconButton>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <IconButton
                          aria-label="Annuler"
                          size="xs"
                          colorPalette="orange"
                          variant="outline"
                          onClick={() => handleCancel(appointment.id)}
                          color="black"
                          _dark={{ color: 'orange.200' }}
                        >
                          <FiX />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="Supprimer"
                        size="xs"
                        colorPalette="red"
                        variant="outline"
                        onClick={() => handleDeleteClick(appointment.id)}
                        color="black"
                        _dark={{ color: 'red.200' }}
                      >
                        <FiTrash2 />
                      </IconButton>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}

        <DialogRoot
          open={appointmentToDelete !== null}
          onOpenChange={(details: { open: boolean }) => {
            if (!details.open && appointmentToDelete !== null) {
              setAppointmentToDelete(null);
            }
          }}
        >
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la suppression</DialogTitle>
              </DialogHeader>
              <DialogCloseTrigger />
              <DialogBody>
                <Text>Êtes-vous sûr de vouloir supprimer ce rendez-vous ?</Text>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline" onClick={handleDeleteCancel}>
                    Annuler
                  </Button>
                </DialogActionTrigger>
                <Button colorPalette="red" onClick={handleDeleteConfirm}>
                  Supprimer
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>
      </VStack>
    </>
  );
}
