'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  Field,
} from '@chakra-ui/react';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import type { Activity, TimeSlot } from '@/presentation/shared/types/appointment';

interface BookingFormProps {
  activity: Activity;
  date: Date;
  slot: TimeSlot;
  onSuccess: (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    customFieldValue: string;
  }) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  customFieldValue?: string;
}

export function BookingForm({
  activity,
  date,
  slot,
  onSuccess,
}: BookingFormProps): React.ReactElement {
  const { themeColor } = useThemeColorContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (field: keyof FormErrors): void => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const requiresPhone = activity.requiredFields?.fields.includes('phone') ?? false;
  const requiresAddress = activity.requiredFields?.fields.includes('address') ?? false;
  const requiresCustom = activity.requiredFields?.fields.includes('custom') ?? false;
  const customLabel = activity.requiredFields?.customFieldLabel || 'Information complémentaire';

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = 'Le nom est requis';
    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (requiresPhone && !phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (requiresAddress && !address.trim()) newErrors.address = "L'adresse est requise";
    if (requiresCustom && !customFieldValue.trim())
      newErrors.customFieldValue = `${customLabel} est requis(e)`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!validate()) return;
    onSuccess({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      customFieldValue: customFieldValue.trim(),
    });
  };

  const startTime = slot.startTime.substring(11, 16);
  const endTime = slot.endTime.substring(11, 16);

  return (
    <VStack gap={5} align="stretch">
      <Heading as="h3" size="md" fontWeight="semibold">
        Vos informations
      </Heading>

      {/* Summary chip */}
      <Box
        px={4}
        py={3}
        borderRadius="xl"
        bg={`${themeColor}.subtle`}
        border="1px solid"
        borderColor={`${themeColor}.subtle`}
      >
        <Text fontSize="sm" fontWeight="medium">
          {activity.name}
          <Text as="span" color="fg.muted" fontWeight="normal">
            {' '}—{' '}
            {date.toLocaleDateString('fr-FR')}{' '}
            {startTime} - {endTime} ({activity.durationMinutes} min)
          </Text>
        </Text>
      </Box>

      <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
        <VStack gap={4} align="stretch">
          {/* Name */}
          <Field.Root invalid={errors.name ? true : undefined} required>
            <Field.Label fontSize="sm" fontWeight="medium">
              Nom complet *
            </Field.Label>
            <Input
              borderRadius="xl"
              bg="whiteAlpha.500"
              backdropFilter="blur(8px)"
              border="1px solid"
              borderColor="whiteAlpha.400"
              _dark={{ bg: 'blackAlpha.300', borderColor: 'whiteAlpha.100' }}
              fontSize={{ base: '16px', md: 'sm' }}
              h={{ base: '48px', md: '40px' }}
              placeholder="Jean Dupont"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError('name'); }}
              autoComplete="name"
            />
            {errors.name && (
              <Field.ErrorText fontSize="xs">{errors.name}</Field.ErrorText>
            )}
          </Field.Root>

          {/* Email */}
          <Field.Root invalid={errors.email ? true : undefined} required>
            <Field.Label fontSize="sm" fontWeight="medium">
              Email *
            </Field.Label>
            <Input
              borderRadius="xl"
              bg="whiteAlpha.500"
              backdropFilter="blur(8px)"
              border="1px solid"
              borderColor="whiteAlpha.400"
              _dark={{ bg: 'blackAlpha.300', borderColor: 'whiteAlpha.100' }}
              fontSize={{ base: '16px', md: 'sm' }}
              h={{ base: '48px', md: '40px' }}
              type="email"
              placeholder="jean@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
              autoComplete="email"
            />
            {errors.email && (
              <Field.ErrorText fontSize="xs">{errors.email}</Field.ErrorText>
            )}
          </Field.Root>

          {/* Phone */}
          {requiresPhone && (
            <Field.Root invalid={errors.phone ? true : undefined} required>
              <Field.Label fontSize="sm" fontWeight="medium">
                Téléphone *
              </Field.Label>
              <Input
                borderRadius="xl"
                bg="whiteAlpha.500"
                backdropFilter="blur(8px)"
                border="1px solid"
                borderColor="whiteAlpha.400"
                _dark={{ bg: 'blackAlpha.300', borderColor: 'whiteAlpha.100' }}
                fontSize={{ base: '16px', md: 'sm' }}
                h={{ base: '48px', md: '40px' }}
                type="tel"
                placeholder="+33 6 00 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
              {errors.phone && (
                <Field.ErrorText fontSize="xs">{errors.phone}</Field.ErrorText>
              )}
            </Field.Root>
          )}

          {/* Address */}
          {requiresAddress && (
            <Field.Root invalid={errors.address ? true : undefined} required>
              <Field.Label fontSize="sm" fontWeight="medium">
                Adresse *
              </Field.Label>
              <textarea
                placeholder="1 rue de la Paix, 75001 Paris"
                value={address}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e.target.value)}
                autoComplete="street-address"
                rows={2}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  borderRadius: '0.75rem',
                  background: 'var(--chakra-colors-whiteAlpha-500)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--chakra-colors-whiteAlpha-400)',
                  padding: '0.5rem 0.75rem',
                  fontSize: '14px',
                  color: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
              {errors.address && (
                <Field.ErrorText fontSize="xs">{errors.address}</Field.ErrorText>
              )}
            </Field.Root>
          )}

          {/* Custom field */}
          {requiresCustom && (
            <Field.Root invalid={errors.customFieldValue ? true : undefined} required>
              <Field.Label fontSize="sm" fontWeight="medium">
                {customLabel} *
              </Field.Label>
              <Input
                borderRadius="xl"
                bg="whiteAlpha.500"
                backdropFilter="blur(8px)"
                border="1px solid"
                borderColor="whiteAlpha.400"
                _dark={{ bg: 'blackAlpha.300', borderColor: 'whiteAlpha.100' }}
                fontSize={{ base: '16px', md: 'sm' }}
                h={{ base: '48px', md: '40px' }}
                value={customFieldValue}
                onChange={(e) => setCustomFieldValue(e.target.value)}
              />
              {errors.customFieldValue && (
                <Field.ErrorText fontSize="xs">
                  {errors.customFieldValue}
                </Field.ErrorText>
              )}
            </Field.Root>
          )}

          <Button
            type="submit"
            colorPalette={themeColor}
            size="lg"
            borderRadius="xl"
            w="full"
            mt={1}
          >
            {requiresPhone || requiresAddress || requiresCustom
              ? 'Continuer'
              : 'Confirmer le rendez-vous'}
          </Button>
        </VStack>
      </form>
    </VStack>
  );
}
