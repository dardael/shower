'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Textarea,
  Table,
  Spinner,
  Field,
  Input,
  Button,
  HStack,
  IconButton,
  Code,
} from '@chakra-ui/react';
import SaveButton from '@/presentation/shared/components/SaveButton';
import { useToastNotifications } from '@/presentation/admin/hooks/useToastNotifications';
import { LuCheck, LuX, LuCopy } from 'react-icons/lu';
import { useDynamicTheme } from '@/presentation/shared/DynamicThemeProvider';

interface EmailTemplateFormProps {
  type:
    | 'admin'
    | 'purchaser'
    | 'appointment-booking'
    | 'appointment-admin-confirmation'
    | 'appointment-admin-new'
    | 'appointment-reminder'
    | 'appointment-cancellation';
  title: string;
  description: string;
}

interface TemplateData {
  subject: string;
  body: string;
  enabled: boolean;
}

interface Placeholder {
  syntax: string;
  description: string;
}

export function EmailTemplateForm({
  type,
  title,
  description,
}: EmailTemplateFormProps): React.ReactElement {
  const [template, setTemplate] = useState<TemplateData>({
    subject: '',
    body: '',
    enabled: false,
  });
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToastNotifications();
  const { themeColor } = useDynamicTheme();

  const handleCopyPlaceholder = async (syntax: string): Promise<void> => {
    const { copyToClipboard } = await import(
      '@/presentation/shared/utils/clipboard'
    );
    const success = await copyToClipboard(syntax);
    if (success) {
      showToast('Variable copiée', 'success');
    } else {
      showToast('Erreur lors de la copie', 'error');
    }
  };

  const fetchTemplate = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/email/templates/${type}`);
      if (response.ok) {
        const data = await response.json();
        setTemplate({
          subject: data.subject || '',
          body: data.body || '',
          enabled: data.enabled || false,
        });
      }
    } catch {
      showToast('Erreur lors du chargement du modèle', 'error');
    }
  }, [type, showToast]);

  const fetchPlaceholders = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(
        `/api/admin/email/placeholders?type=${type}`
      );
      if (response.ok) {
        const data = await response.json();
        setPlaceholders(data.placeholders || []);
      }
    } catch {
      // Placeholders are optional, ignore errors
    }
  }, [type]);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setIsLoading(true);
      await Promise.all([fetchTemplate(), fetchPlaceholders()]);
      setIsLoading(false);
    };
    void loadData();
  }, [fetchTemplate, fetchPlaceholders]);

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/email/templates/${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      if (response.ok) {
        showToast('Modèle enregistré avec succès', 'success');
      } else {
        const error = await response.json();
        showToast(error.message || 'Erreur lors de la sauvegarde', 'error');
      }
    } catch {
      showToast('Erreur lors de la sauvegarde du modèle', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <VStack gap={6} align="stretch">
        <Box>
          <Heading size="md">{title}</Heading>
          <Text color="gray.600" fontSize="sm" mt={1}>
            {description}
          </Text>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Text fontWeight="medium">Activer les notifications</Text>
          <HStack>
            <Button
              size="sm"
              variant={template.enabled ? 'solid' : 'outline'}
              colorPalette={template.enabled ? 'green' : 'gray'}
              onClick={() =>
                setTemplate((prev) => ({ ...prev, enabled: true }))
              }
            >
              <LuCheck />
              Activé
            </Button>
            <Button
              size="sm"
              variant={!template.enabled ? 'solid' : 'outline'}
              colorPalette={!template.enabled ? 'red' : 'gray'}
              onClick={() =>
                setTemplate((prev) => ({ ...prev, enabled: false }))
              }
            >
              <LuX />
              Désactivé
            </Button>
          </HStack>
        </Box>

        <Field.Root>
          <Field.Label>Objet de l&apos;email</Field.Label>
          <Input
            value={template.subject}
            onChange={(e) =>
              setTemplate((prev) => ({ ...prev, subject: e.target.value }))
            }
            placeholder="Ex: Nouvelle commande #{{order_id}}"
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Corps de l&apos;email</Field.Label>
          <Textarea
            value={template.body}
            onChange={(e) =>
              setTemplate((prev) => ({ ...prev, body: e.target.value }))
            }
            placeholder="Contenu de l'email..."
            rows={10}
          />
        </Field.Root>

        {placeholders.length > 0 && (
          <Box>
            <Heading size="sm" mb={3}>
              Variables disponibles
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Cliquez sur une variable pour la copier
            </Text>
            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Variable</Table.ColumnHeader>
                  <Table.ColumnHeader>Description</Table.ColumnHeader>
                  <Table.ColumnHeader width="60px"></Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {placeholders.map((placeholder) => (
                  <Table.Row key={placeholder.syntax}>
                    <Table.Cell>
                      <Code
                        colorPalette={themeColor}
                        px={2}
                        py={1}
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() =>
                          handleCopyPlaceholder(placeholder.syntax)
                        }
                        _hover={{ opacity: 0.8 }}
                      >
                        {placeholder.syntax}
                      </Code>
                    </Table.Cell>
                    <Table.Cell>{placeholder.description}</Table.Cell>
                    <Table.Cell>
                      <IconButton
                        aria-label="Copier"
                        size="xs"
                        variant="ghost"
                        colorPalette={themeColor}
                        onClick={() =>
                          handleCopyPlaceholder(placeholder.syntax)
                        }
                      >
                        <LuCopy />
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end">
          <SaveButton onClick={handleSave} isLoading={isSaving}>
            Enregistrer
          </SaveButton>
        </Box>
      </VStack>
    </Box>
  );
}
