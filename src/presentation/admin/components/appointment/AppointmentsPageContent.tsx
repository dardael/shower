'use client';

import { Box, Heading, Tabs, Text } from '@chakra-ui/react';
import { useAppointmentModule } from '@/presentation/shared/contexts/AppointmentModuleContext';
import { ActivityList } from '@/presentation/admin/components/appointment/ActivityList';
import { AvailabilityEditorContainer } from '@/presentation/admin/components/appointment/AvailabilityEditorContainer';
import { AppointmentCalendar } from '@/presentation/admin/components/appointment/AppointmentCalendar';
import { AppointmentList } from '@/presentation/admin/components/appointment/AppointmentList';

export function AppointmentsPageContent(): React.ReactElement {
  const { isEnabled, isLoading } = useAppointmentModule();

  if (isLoading) {
    return (
      <Box p={6}>
        <Text>Chargement...</Text>
      </Box>
    );
  }

  if (!isEnabled) {
    return (
      <Box p={6}>
        <Heading size="lg" mb={4}>
          Rendez-vous
        </Heading>
        <Text>
          Le module de rendez-vous est désactivé. Vous pouvez l&apos;activer
          dans les paramètres du site.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Rendez-vous
      </Heading>

      <Tabs.Root defaultValue="appointments" variant="line">
        <Tabs.List mb={4}>
          <Tabs.Trigger value="appointments">Rendez-vous</Tabs.Trigger>
          <Tabs.Trigger value="calendar">Calendrier</Tabs.Trigger>
          <Tabs.Trigger value="activities">Activités</Tabs.Trigger>
          <Tabs.Trigger value="availability">Disponibilités</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="appointments">
          <AppointmentList />
        </Tabs.Content>

        <Tabs.Content value="calendar">
          <AppointmentCalendar />
        </Tabs.Content>

        <Tabs.Content value="activities">
          <ActivityList />
        </Tabs.Content>

        <Tabs.Content value="availability">
          <AvailabilityEditorContainer />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
