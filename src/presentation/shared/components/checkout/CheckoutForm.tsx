'use client';

import React, { useState } from 'react';
import { Box, VStack, Input, Button, Field } from '@chakra-ui/react';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CustomerFormData) => Promise<void>;
  isSubmitting: boolean;
  totalPrice: string;
}

export function CheckoutForm({
  onSubmit,
  isSubmitting,
  totalPrice,
}: CheckoutFormProps): React.ReactElement {
  const { themeColor } = useThemeColorContext();
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est requise";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else {
      const normalized = formData.phone.replace(/[\s\-\.]/g, '');
      const frenchRegex = /^0[1-9][0-9]{8}$/;
      const internationalRegex = /^\+33[1-9][0-9]{8}$/;
      if (
        !frenchRegex.test(normalized) &&
        !internationalRegex.test(normalized)
      ) {
        newErrors.phone = 'Format de numéro de téléphone invalide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const handleChange = (field: keyof CustomerFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack gap={4} align="stretch">
        <Field.Root invalid={!!errors.firstName}>
          <Field.Label>Prénom</Field.Label>
          <Input
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Votre prénom"
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <Field.ErrorText>{errors.firstName}</Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!errors.lastName}>
          <Field.Label>Nom</Field.Label>
          <Input
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Votre nom"
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <Field.ErrorText>{errors.lastName}</Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="votre@email.com"
            disabled={isSubmitting}
          />
          {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.phone}>
          <Field.Label>Téléphone</Field.Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="06 12 34 56 78"
            disabled={isSubmitting}
          />
          {errors.phone && <Field.ErrorText>{errors.phone}</Field.ErrorText>}
        </Field.Root>

        <Box pt={4}>
          <Button
            type="submit"
            colorPalette={themeColor}
            width="100%"
            size="lg"
            loading={isSubmitting}
            loadingText="Envoi en cours..."
          >
            Confirmer la commande ({totalPrice})
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
