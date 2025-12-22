'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, HStack, Text, Badge, Spinner, VStack } from '@chakra-ui/react';
import { FiMail, FiCheck, FiAlertCircle } from 'react-icons/fi';

interface EmailConfigurationStatus {
  smtpConfigured: boolean;
  adminEmailConfigured: boolean;
  adminTemplateEnabled: boolean;
  purchaserTemplateEnabled: boolean;
  isFullyConfigured: boolean;
  details: {
    smtpHost: string | null;
    smtpPort: number | null;
    adminEmail: string | null;
    senderEmail: string | null;
  };
}

export function EmailConfigurationStatusIndicator(): React.ReactElement {
  const [status, setStatus] = useState<EmailConfigurationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/email/status');
      if (!response.ok) {
        throw new Error('Failed to fetch status');
      }
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch {
      setError('Impossible de charger le statut');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (loading) {
    return (
      <HStack gap={2} p={3} borderWidth={1} borderRadius="md">
        <Spinner size="sm" />
        <Text fontSize="sm">Chargement du statut...</Text>
      </HStack>
    );
  }

  if (error) {
    return (
      <HStack gap={2} p={3} borderWidth={1} borderRadius="md" bg="red.50">
        <Box as={FiAlertCircle} color="red.500" />
        <Text fontSize="sm" color="red.600">
          {error}
        </Text>
      </HStack>
    );
  }

  if (!status) {
    return <Box />;
  }

  return (
    <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
      <HStack gap={2} mb={3}>
        <Box as={FiMail} />
        <Text fontWeight="bold">Configuration email</Text>
        {status.isFullyConfigured ? (
          <Badge colorPalette="green">
            <HStack gap={1}>
              <Box as={FiCheck} />
              <span>Configuré</span>
            </HStack>
          </Badge>
        ) : (
          <Badge colorPalette="yellow">
            <HStack gap={1}>
              <Box as={FiAlertCircle} />
              <span>Configuration incomplète</span>
            </HStack>
          </Badge>
        )}
      </HStack>

      <VStack align="stretch" gap={2}>
        <HStack justify="space-between">
          <Text fontSize="sm">Serveur SMTP</Text>
          <Badge colorPalette={status.smtpConfigured ? 'green' : 'gray'}>
            {status.smtpConfigured ? 'Configuré' : 'Non configuré'}
          </Badge>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="sm">Email administrateur</Text>
          <Badge colorPalette={status.adminEmailConfigured ? 'green' : 'gray'}>
            {status.adminEmailConfigured ? 'Configuré' : 'Non configuré'}
          </Badge>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="sm">Notification admin</Text>
          <Badge colorPalette={status.adminTemplateEnabled ? 'green' : 'gray'}>
            {status.adminTemplateEnabled ? 'Activée' : 'Désactivée'}
          </Badge>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="sm">Notification acheteur</Text>
          <Badge
            colorPalette={status.purchaserTemplateEnabled ? 'green' : 'gray'}
          >
            {status.purchaserTemplateEnabled ? 'Activée' : 'Désactivée'}
          </Badge>
        </HStack>
      </VStack>
    </Box>
  );
}

export default EmailConfigurationStatusIndicator;
