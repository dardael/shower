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
  HStack,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { FiMail, FiCheck, FiX } from 'react-icons/fi';
import SaveButton from '@/presentation/shared/components/SaveButton';
import { useToastNotifications } from '@/presentation/admin/hooks/useToastNotifications';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { useDynamicTheme } from '@/presentation/shared/DynamicThemeProvider';

interface SmtpSettingsData {
  host: string;
  port: number;
  username: string;
  encryptionType: 'ssl' | 'tls' | 'none';
  isConfigured: boolean;
}

export default function SmtpSettingsForm() {
  const { showToast } = useToastNotifications();
  const { themeColor } = useDynamicTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [host, setHost] = useState('');
  const [port, setPort] = useState(587);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [encryptionType, setEncryptionType] = useState<'ssl' | 'tls' | 'none'>(
    'tls'
  );
  const [testEmail, setTestEmail] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/email/smtp');
      if (response.ok) {
        const data: SmtpSettingsData = await response.json();
        setHost(data.host || '');
        setPort(data.port || 587);
        setUsername(data.username || '');
        setEncryptionType(data.encryptionType || 'tls');
      }
    } catch (error) {
      console.error('Error fetching SMTP settings:', error);
      showToast('Erreur lors de la récupération des paramètres SMTP', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/admin/email/smtp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host,
          port,
          username,
          password: password || undefined,
          encryptionType,
        }),
      });

      if (response.ok) {
        showToast('Paramètres SMTP enregistrés avec succès', 'success');
        setPassword('');
      } else {
        const data = await response.json();
        showToast(data.error || 'Erreur lors de la sauvegarde', 'error');
      }
    } catch (error) {
      console.error('Error saving SMTP settings:', error);
      showToast('Erreur lors de la sauvegarde des paramètres', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!testEmail) {
      showToast('Veuillez entrer une adresse email de test', 'error');
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/admin/email/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail: testEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTestResult({
          success: true,
          message: 'Email de test envoyé avec succès',
        });
        showToast('Email de test envoyé avec succès', 'success');
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Échec du test de connexion',
        });
        showToast(data.error || 'Échec du test de connexion', 'error');
      }
    } catch (error) {
      console.error('Error testing SMTP connection:', error);
      setTestResult({ success: false, message: 'Erreur lors du test' });
      showToast('Erreur lors du test de connexion', 'error');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <Box
        bg="bg.subtle"
        borderRadius="2xl"
        border="1px solid"
        borderColor="border"
        p={{ base: 4, sm: 6, md: 8 }}
        boxShadow="sm"
      >
        <HStack justify="center" py={8}>
          <Spinner size="lg" />
          <Text color="fg.muted">Chargement des paramètres SMTP...</Text>
        </HStack>
      </Box>
    );
  }

  return (
    <Box
      bg="bg.subtle"
      borderRadius="2xl"
      border="1px solid"
      borderColor="border"
      p={{ base: 4, sm: 6, md: 8 }}
      boxShadow="sm"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        bg: 'linear-gradient(90deg, colorPalette.solid, colorPalette.muted)',
        borderRadius: '2xl 2xl 0 0',
      }}
    >
      <VStack align="start" gap={2} mb={{ base: 4, md: 6 }}>
        <Heading
          as="h2"
          size={{ base: 'lg', md: 'xl' }}
          fontWeight="semibold"
          color="fg"
          display="flex"
          alignItems="center"
          gap={3}
        >
          <Box w="8px" h="8px" borderRadius="full" bg="colorPalette.solid" />
          Configuration SMTP
        </Heading>
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="fg.muted"
          lineHeight="relaxed"
        >
          Configurez le serveur SMTP pour l&apos;envoi des emails de
          notification
        </Text>
      </VStack>

      <form onSubmit={handleSubmit}>
        <Stack gap={{ base: 4, md: 6 }}>
          <Field.Root>
            <Field.Label
              htmlFor="smtp-host"
              fontSize="sm"
              fontWeight="semibold"
              color="fg"
              mb={2}
            >
              Serveur SMTP
            </Field.Label>
            <Input
              id="smtp-host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="smtp.example.com"
              required
              bg="bg.canvas"
              borderColor="border"
              borderWidth="2px"
              borderRadius="lg"
              fontSize={{ base: 'sm', md: 'md' }}
              color="fg"
              _placeholder={{ color: 'fg.muted' }}
              _focus={{
                borderColor: 'colorPalette.solid',
                boxShadow: '0 0 0 3px colorPalette.subtle',
              }}
            />
          </Field.Root>

          <HStack gap={4} align="start">
            <Field.Root flex={1}>
              <Field.Label
                htmlFor="smtp-port"
                fontSize="sm"
                fontWeight="semibold"
                color="fg"
                mb={2}
              >
                Port
              </Field.Label>
              <Input
                id="smtp-port"
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                min={1}
                max={65535}
                required
                bg="bg.canvas"
                borderColor="border"
                borderWidth="2px"
                borderRadius="lg"
                fontSize={{ base: 'sm', md: 'md' }}
                color="fg"
              />
            </Field.Root>

            <Field.Root flex={1}>
              <Field.Label
                htmlFor="smtp-encryption"
                fontSize="sm"
                fontWeight="semibold"
                color="fg"
                mb={2}
              >
                Chiffrement
              </Field.Label>
              <NativeSelectRoot>
                <NativeSelectField
                  id="smtp-encryption"
                  value={encryptionType}
                  onChange={(e) =>
                    setEncryptionType(e.target.value as 'ssl' | 'tls' | 'none')
                  }
                  bg="bg.canvas"
                  borderColor="border"
                  borderWidth="2px"
                  borderRadius="lg"
                  fontSize={{ base: 'sm', md: 'md' }}
                  color="fg"
                >
                  <option value="tls">TLS (Port 587)</option>
                  <option value="ssl">SSL (Port 465)</option>
                  <option value="none">Aucun</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </Field.Root>
          </HStack>

          <Field.Root>
            <Field.Label
              htmlFor="smtp-username"
              fontSize="sm"
              fontWeight="semibold"
              color="fg"
              mb={2}
            >
              Nom d&apos;utilisateur
            </Field.Label>
            <Input
              id="smtp-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="user@example.com"
              required
              bg="bg.canvas"
              borderColor="border"
              borderWidth="2px"
              borderRadius="lg"
              fontSize={{ base: 'sm', md: 'md' }}
              color="fg"
              _placeholder={{ color: 'fg.muted' }}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label
              htmlFor="smtp-password"
              fontSize="sm"
              fontWeight="semibold"
              color="fg"
              mb={2}
            >
              Mot de passe
            </Field.Label>
            <Input
              id="smtp-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              bg="bg.canvas"
              borderColor="border"
              borderWidth="2px"
              borderRadius="lg"
              fontSize={{ base: 'sm', md: 'md' }}
              color="fg"
              _placeholder={{ color: 'fg.muted' }}
            />
            <Field.HelperText
              fontSize={{ base: 'xs', md: 'sm' }}
              color="fg.muted"
              mt={2}
            >
              Laissez vide pour conserver le mot de passe actuel
            </Field.HelperText>
          </Field.Root>

          <Box w="full">
            <SaveButton
              type="submit"
              isLoading={saving}
              loadingText="Enregistrement..."
              width="full"
            >
              Enregistrer les paramètres SMTP
            </SaveButton>
          </Box>

          <Box
            bg="bg.canvas"
            borderColor="border"
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            mt={4}
          >
            <Text fontSize="sm" fontWeight="semibold" color="fg" mb={3}>
              Tester la connexion
            </Text>
            <HStack gap={3}>
              <Input
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="email@test.com"
                type="email"
                flex={1}
                bg="bg.canvas"
                borderColor="border"
                borderWidth="2px"
                borderRadius="lg"
                fontSize={{ base: 'sm', md: 'md' }}
                color="fg"
                _placeholder={{ color: 'fg.muted' }}
              />
              <Button
                onClick={handleTestConnection}
                disabled={testing || !host || !username}
                colorPalette={themeColor}
                variant="solid"
                minW="120px"
              >
                {testing ? <Spinner size="sm" /> : <FiMail />}
                {testing ? 'Envoi...' : 'Tester'}
              </Button>
            </HStack>
            {testResult && (
              <HStack mt={3} gap={2}>
                {testResult.success ? (
                  <FiCheck color="green" />
                ) : (
                  <FiX color="red" />
                )}
                <Text
                  fontSize="sm"
                  color={testResult.success ? 'green.500' : 'red.500'}
                >
                  {testResult.message}
                </Text>
              </HStack>
            )}
          </Box>
        </Stack>
      </form>
    </Box>
  );
}
