'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Field,
  Heading,
  HStack,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import type { Activity } from '@/presentation/shared/types/appointment';
import { useThemeColor } from '@/presentation/shared/hooks/useThemeColor';

interface ActivityFormProps {
  activity: Activity | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ActivityForm({
  activity,
  onSuccess,
  onCancel,
}: ActivityFormProps): React.ReactElement {
  const { themeColor } = useThemeColor();
  const [name, setName] = useState(activity?.name || '');
  const [description, setDescription] = useState(activity?.description || '');
  const [durationMinutes, setDurationMinutes] = useState(
    activity?.durationMinutes || 60
  );
  const [color, setColor] = useState(activity?.color || '#3182ce');
  const [price, setPrice] = useState(activity?.price || 0);
  const [minimumBookingNoticeHours, setMinimumBookingNoticeHours] = useState(
    activity?.minimumBookingNoticeHours || 0
  );

  const [requirePhone, setRequirePhone] = useState(
    activity?.requiredFields.fields.includes('phone') || false
  );
  const [requireAddress, setRequireAddress] = useState(
    activity?.requiredFields.fields.includes('address') || false
  );
  const [requireCustom, setRequireCustom] = useState(
    activity?.requiredFields.fields.includes('custom') || false
  );
  const [customFieldLabel, setCustomFieldLabel] = useState(
    activity?.requiredFields.customFieldLabel || ''
  );

  const [reminderEnabled, setReminderEnabled] = useState(
    activity?.reminderSettings.enabled || false
  );
  const [reminderHoursBefore, setReminderHoursBefore] = useState(
    activity?.reminderSettings.hoursBefore || 24
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const fields: Array<'name' | 'email' | 'phone' | 'address' | 'custom'> = [
      'name',
      'email',
    ];
    if (requirePhone) fields.push('phone');
    if (requireAddress) fields.push('address');
    if (requireCustom) fields.push('custom');

    const payload = {
      name,
      description: description || undefined,
      durationMinutes,
      color,
      price,
      minimumBookingNoticeHours,
      requiredFields: {
        fields,
        customFieldLabel: requireCustom ? customFieldLabel : undefined,
      },
      reminderSettings: {
        enabled: reminderEnabled,
        hoursBefore: reminderEnabled ? reminderHoursBefore : undefined,
      },
    };

    try {
      const url = activity
        ? `/api/appointments/activities/${activity.id}`
        : '/api/appointments/activities';
      const method = activity ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'enregistrement");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Heading size="md" mb={4}>
        {activity ? "Modifier l'activité" : 'Nouvelle activité'}
      </Heading>

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

      <VStack gap={4} align="stretch">
        <Field.Root>
          <Field.Label>Nom de l&apos;activité</Field.Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Consultation initiale"
            required
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Description</Field.Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de l'activité..."
          />
        </Field.Root>

        <HStack gap={4}>
          <Field.Root flex={1}>
            <Field.Label>Durée (minutes)</Field.Label>
            <Input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              min={1}
              required
            />
          </Field.Root>

          <Field.Root flex={1}>
            <Field.Label>Prix (€)</Field.Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min={0}
              step={0.01}
              required
            />
          </Field.Root>
        </HStack>

        <HStack gap={4}>
          <Field.Root flex={1}>
            <Field.Label>Couleur</Field.Label>
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </Field.Root>

          <Field.Root flex={1}>
            <Field.Label>Délai minimum de réservation (heures)</Field.Label>
            <Input
              type="number"
              value={minimumBookingNoticeHours}
              onChange={(e) =>
                setMinimumBookingNoticeHours(Number(e.target.value))
              }
              min={0}
            />
          </Field.Root>
        </HStack>

        <Box>
          <Heading size="sm" mb={2}>
            Informations requises du client
          </Heading>
          <VStack align="start" gap={2}>
            <Checkbox.Root disabled checked>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Nom (obligatoire)</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root disabled checked>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Email (obligatoire)</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root
              checked={requirePhone}
              onCheckedChange={(e) => setRequirePhone(e.checked === true)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Téléphone</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root
              checked={requireAddress}
              onCheckedChange={(e) => setRequireAddress(e.checked === true)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Adresse</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root
              checked={requireCustom}
              onCheckedChange={(e) => setRequireCustom(e.checked === true)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Champ personnalisé</Checkbox.Label>
            </Checkbox.Root>
            {requireCustom && (
              <Field.Root ml={6}>
                <Field.Label>Libellé du champ personnalisé</Field.Label>
                <Input
                  value={customFieldLabel}
                  onChange={(e) => setCustomFieldLabel(e.target.value)}
                  placeholder="Ex: Motif de la consultation"
                  required
                />
              </Field.Root>
            )}
          </VStack>
        </Box>

        <Box>
          <Heading size="sm" mb={2}>
            Rappel par email
          </Heading>
          <VStack align="start" gap={2}>
            <Checkbox.Root
              checked={reminderEnabled}
              onCheckedChange={(e) => setReminderEnabled(e.checked === true)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Envoyer un rappel par email</Checkbox.Label>
            </Checkbox.Root>
            {reminderEnabled && (
              <Field.Root ml={6}>
                <Field.Label>Heures avant le rendez-vous</Field.Label>
                <Input
                  type="number"
                  value={reminderHoursBefore}
                  onChange={(e) =>
                    setReminderHoursBefore(Number(e.target.value))
                  }
                  min={1}
                  required
                />
              </Field.Root>
            )}
          </VStack>
        </Box>

        <HStack justify="flex-end" gap={2} pt={4}>
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            type="submit"
            colorPalette={themeColor}
            loading={isSubmitting}
          >
            {activity ? 'Enregistrer' : 'Créer'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
