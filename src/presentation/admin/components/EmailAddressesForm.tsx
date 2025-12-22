'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Heading,
  Stack,
  Field,
  Input,
  Text,
  Box,
  VStack,
} from '@chakra-ui/react';
import SaveButton from '@/presentation/shared/components/SaveButton';
import { useToastNotifications } from '@/presentation/admin/hooks/useToastNotifications';

interface EmailSettingsData {
  administratorEmail: string;
}

export default function EmailAddressesForm(): React.ReactElement {
  const { showToast } = useToastNotifications();
  const [administratorEmail, setAdministratorEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/admin/email/addresses');
      if (response.ok) {
        const data: EmailSettingsData = await response.json();
        setAdministratorEmail(data.administratorEmail || '');
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
      showToast('Impossible de charger les adresses email', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/email/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ administratorEmail }),
      });

      if (response.ok) {
        showToast('Les adresses email ont été enregistrées', 'success');
      } else {
        const data = await response.json();
        showToast(
          data.error || 'Impossible de sauvegarder les paramètres',
          'error'
        );
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      showToast('Impossible de sauvegarder les paramètres', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box p={4}>
        <Text>Chargement...</Text>
      </Box>
    );
  }

  const isValidEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValid = isValidEmail(administratorEmail);

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <VStack gap={4} align="stretch">
        <Heading size="md">Email administrateur</Heading>
        <Text color="gray.600" fontSize="sm">
          L&apos;adresse d&apos;expéditeur sera celle configurée dans le serveur
          SMTP.
        </Text>

        <Stack gap={4}>
          <Field.Root>
            <Field.Label>Email administrateur</Field.Label>
            <Input
              type="email"
              value={administratorEmail}
              onChange={(e) => setAdministratorEmail(e.target.value)}
              placeholder="admin@example.com"
            />
            <Field.HelperText>
              Adresse où seront envoyées les notifications de nouvelles
              commandes
            </Field.HelperText>
          </Field.Root>
        </Stack>

        <SaveButton
          onClick={handleSave}
          isLoading={isSaving}
          disabled={!isValid}
        >
          Enregistrer
        </SaveButton>
      </VStack>
    </Box>
  );
}
