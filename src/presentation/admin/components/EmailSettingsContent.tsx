'use client';

import { VStack, Heading, Text, Box, Tabs } from '@chakra-ui/react';
import SmtpSettingsForm from '@/presentation/admin/components/SmtpSettingsForm';
import EmailAddressesForm from '@/presentation/admin/components/EmailAddressesForm';
import { EmailTemplateForm } from '@/presentation/admin/components/EmailTemplateForm';
import EmailLogsDisplay from '@/presentation/admin/components/EmailLogsDisplay';
import { AdminLoadingScreen } from '@/presentation/admin/components/AdminLoadingScreen';
import { useSellingConfig } from '@/presentation/shared/contexts/SellingConfigContext';
import { useAppointmentModule } from '@/presentation/shared/contexts/AppointmentModuleContext';

export default function EmailSettingsContent(): React.ReactElement {
  const { sellingEnabled } = useSellingConfig();
  const { isEnabled: appointmentModuleEnabled } = useAppointmentModule();

  return (
    <AdminLoadingScreen>
      <Box maxW="container.lg" mx="auto" py={8} px={4}>
        <VStack gap={8} align="stretch">
          <Box>
            <Heading size="lg">Configuration des emails</Heading>
            <Text color="gray.600" mt={2}>
              Configurez les notifications par email pour les commandes et
              rendez-vous.
            </Text>
          </Box>

          <Tabs.Root defaultValue="smtp" variant="enclosed">
            <Tabs.List>
              <Tabs.Trigger value="smtp">Serveur SMTP</Tabs.Trigger>
              <Tabs.Trigger value="addresses">Adresses email</Tabs.Trigger>
              {sellingEnabled && (
                <>
                  <Tabs.Trigger value="admin-template">
                    Notification administrateur
                  </Tabs.Trigger>
                  <Tabs.Trigger value="purchaser-template">
                    Notification acheteur
                  </Tabs.Trigger>
                </>
              )}
              {appointmentModuleEnabled && (
                <>
                  <Tabs.Trigger value="appointment-booking">
                    Confirmation rendez-vous
                  </Tabs.Trigger>
                  <Tabs.Trigger value="appointment-admin-new">
                    Notification admin nouveau RDV
                  </Tabs.Trigger>
                  <Tabs.Trigger value="appointment-admin-confirmation">
                    Confirmation admin RDV
                  </Tabs.Trigger>
                  <Tabs.Trigger value="appointment-reminder">
                    Rappel rendez-vous
                  </Tabs.Trigger>
                  <Tabs.Trigger value="appointment-cancellation">
                    Annulation rendez-vous
                  </Tabs.Trigger>
                </>
              )}
              <Tabs.Trigger value="logs">Historique</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="smtp">
              <Box pt={6}>
                <SmtpSettingsForm />
              </Box>
            </Tabs.Content>

            <Tabs.Content value="addresses">
              <Box pt={6}>
                <EmailAddressesForm />
              </Box>
            </Tabs.Content>

            {sellingEnabled && (
              <>
                <Tabs.Content value="admin-template">
                  <Box pt={6}>
                    <EmailTemplateForm
                      type="admin"
                      title="Notification administrateur"
                      description="Email envoyé à l'administrateur lorsqu'une nouvelle commande est passée."
                    />
                  </Box>
                </Tabs.Content>

                <Tabs.Content value="purchaser-template">
                  <Box pt={6}>
                    <EmailTemplateForm
                      type="purchaser"
                      title="Notification acheteur"
                      description="Email envoyé à l'acheteur pour confirmer sa commande."
                    />
                  </Box>
                </Tabs.Content>
              </>
            )}

            {appointmentModuleEnabled && (
              <>
                <Tabs.Content value="appointment-booking">
                  <Box pt={6}>
                    <EmailTemplateForm
                      type="appointment-booking"
                      title="Confirmation de rendez-vous"
                      description="Email envoyé au client pour confirmer son rendez-vous."
                    />
                  </Box>
                </Tabs.Content>

                <Tabs.Content value="appointment-admin-new">
                  <Box pt={6}>
                    <EmailTemplateForm
                      type="appointment-admin-new"
                      title="Notification nouveau rendez-vous"
                      description="Email envoyé à l'administrateur lorsqu'un nouveau rendez-vous est pris."
                    />
                  </Box>
                </Tabs.Content>

                <Tabs.Content value="appointment-admin-confirmation">
                  <Box pt={6}>
                    <EmailTemplateForm
                      type="appointment-admin-confirmation"
                      title="Confirmation de rendez-vous par l'admin"
                      description="Email envoyé au client lorsque l'administrateur confirme son rendez-vous."
                    />
                  </Box>
                </Tabs.Content>

                <Tabs.Content value="appointment-reminder">
                  <Box pt={6}>
                    <EmailTemplateForm
                      type="appointment-reminder"
                      title="Rappel de rendez-vous"
                      description="Email de rappel envoyé au client avant son rendez-vous."
                    />
                  </Box>
                </Tabs.Content>

                <Tabs.Content value="appointment-cancellation">
                  <Box pt={6}>
                    <EmailTemplateForm
                      type="appointment-cancellation"
                      title="Annulation de rendez-vous"
                      description="Email envoyé au client lors de l'annulation de son rendez-vous."
                    />
                  </Box>
                </Tabs.Content>
              </>
            )}

            <Tabs.Content value="logs">
              <Box pt={6}>
                <EmailLogsDisplay />
              </Box>
            </Tabs.Content>
          </Tabs.Root>
        </VStack>
      </Box>
    </AdminLoadingScreen>
  );
}
