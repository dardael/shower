'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import type { Activity, TimeSlot } from '@/presentation/shared/types/appointment';

interface BookingFormProps {
  activity: Activity;
  date: Date;
  slot: TimeSlot;
  onSuccess: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  customFieldValue: string;
}

export function BookingForm({
  activity,
  date,
  slot,
  onSuccess,
}: BookingFormProps): React.ReactElement {
  const { themeColor } = useThemeColorContext();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    customFieldValue: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const requiredFields = activity.requiredFields || {
    fields: ['name', 'email'],
  };

  const isPhoneRequired = requiredFields.fields.includes('phone');
  const isAddressRequired = requiredFields.fields.includes('address');
  const isCustomFieldRequired = requiredFields.fields.includes('custom');

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (isPhoneRequired && !formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    if (isAddressRequired && !formData.address.trim()) {
      newErrors.address = "L'adresse est requise";
    }

    if (isCustomFieldRequired && !formData.customFieldValue.trim()) {
      newErrors.customFieldValue = 'Ce champ est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (!validateForm()) return;
    onSuccess(formData);
  };

  const handleChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <VStack gap={4} align="stretch">
      <Box p={4} bg={`${themeColor}.muted`} _dark={{ bg: `${themeColor}.muted` }} borderRadius="md">
        <Text fontWeight="semibold">{activity.name}</Text>
        <Text fontSize="sm">
          {date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}{' '}
          {slot.startTime.substring(11, 16)} - {slot.endTime.substring(11, 16)}
          {' '} ({activity.durationMinutes} min)
        </Text>
      </Box>

      <VStack gap={4} align="stretch">
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={1}>
            Nom complet *
          </Text>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Jean Dupont"
          />
          {errors.name && (
            <Text color="red.500" fontSize="sm">
              {errors.name}
            </Text>
          )}
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={1}>
            Email *
          </Text>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="jean@example.com"
          />
          {errors.email && (
            <Text color="red.500" fontSize="sm">
              {errors.email}
            </Text>
          )}
        </Box>

        {isPhoneRequired && (
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              Téléphone *
            </Text>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="06 12 34 56 78"
            />
            {errors.phone && (
              <Text color="red.500" fontSize="sm">
                {errors.phone}
              </Text>
            )}
          </Box>
        )}

        {isAddressRequired && (
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              Adresse *
            </Text>
            <Input
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="123 Rue de Paris, 75001 Paris"
            />
            {errors.address && (
              <Text color="red.500" fontSize="sm">
                {errors.address}
              </Text>
            )}
          </Box>
        )}

        {isCustomFieldRequired && (
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              {requiredFields.customFieldLabel || 'Information complémentaire'} *
            </Text>
            <Input
              value={formData.customFieldValue}
              onChange={(e) => handleChange('customFieldValue', e.target.value)}
            />
            {errors.customFieldValue && (
              <Text color="red.500" fontSize="sm">
                {errors.customFieldValue}
              </Text>
            )}
          </Box>
        )}
      </VStack>

      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          colorPalette={themeColor}
          onClick={handleSubmit}
          width="full"
          maxW="400px"
        >
          {isPhoneRequired || isAddressRequired || isCustomFieldRequired
            ? 'Continuer'
            : 'Confirmer le rendez-vous'}
        </Button>
      </Box>
    </VStack>
  );
}
