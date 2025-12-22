'use client';

import { VStack, Heading, Text, Box, Tabs } from '@chakra-ui/react';
import SmtpSettingsForm from '@/presentation/admin/components/SmtpSettingsForm';
import EmailAddressesForm from '@/presentation/admin/components/EmailAddressesForm';
import { EmailTemplateForm } from '@/presentation/admin/components/EmailTemplateForm';
import EmailLogsDisplay from '@/presentation/admin/components/EmailLogsDisplay';
import { AdminLoadingScreen } from '@/presentation/admin/components/AdminLoadingScreen';

export default function EmailSettingsContent(): React.ReactElement {
  return (
    <AdminLoadingScreen>
      <Box maxW="container.lg" mx="auto" py={8} px={4}>
        <VStack gap={8} align="stretch">
          <Box>
            <Heading size="lg">Configuration des emails</Heading>
            <Text color="gray.600" mt={2}>
              Configurez les notifications par email pour les commandes.
            </Text>
          </Box>

          <Tabs.Root defaultValue="smtp" variant="enclosed">
            <Tabs.List>
              <Tabs.Trigger value="smtp">Serveur SMTP</Tabs.Trigger>
              <Tabs.Trigger value="addresses">Adresses email</Tabs.Trigger>
              <Tabs.Trigger value="admin-template">
                Notification administrateur
              </Tabs.Trigger>
              <Tabs.Trigger value="purchaser-template">
                Notification acheteur
              </Tabs.Trigger>
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
