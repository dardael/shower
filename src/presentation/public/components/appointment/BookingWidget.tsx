'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import { toaster } from '@/presentation/shared/components/ui/toaster';
import { ActivitySelector } from './ActivitySelector';
import { SlotPicker } from './SlotPicker';
import { BookingForm } from './BookingForm';
import { frontendLog } from '@/infrastructure/shared/services/FrontendLog';
import type { Activity, TimeSlot } from '@/presentation/shared/types/appointment';

type BookingStep = 'activity' | 'slot' | 'form' | 'confirm' | 'success';

export function BookingWidget(): React.ReactElement {
  const { themeColor } = useThemeColorContext();
  const [step, setStep] = useState<BookingStep>('activity');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone?: string;
    address?: string;
    customFieldValue?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActivitySelect = (activity: Activity): void => {
    setSelectedActivity(activity);
    setStep('slot');
  };

  const handleSlotSelect = (date: Date, slot: TimeSlot): void => {
    setSelectedDate(date);
    setSelectedSlot(slot);
    setStep('form');
  };

  const handleFormSubmit = (data: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    customFieldValue?: string;
  }): void => {
    setFormData(data);
    setStep('confirm');
  };

  const handleConfirmBooking = async (): Promise<void> => {
    if (!selectedActivity || !selectedDate || !selectedSlot || !formData) {
      return;
    }

    setIsSubmitting(true);
    try {
      // selectedSlot.startTime is already an ISO string from the API
      const dateTime = new Date(selectedSlot.startTime);

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: selectedActivity.id,
          dateTime: dateTime.toISOString(),
          clientInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            customField: formData.customFieldValue,
          },
        }),
      });

      if (response.ok) {
        setStep('success');
      } else {
        const error = await response.json();
        frontendLog.error('Erreur réservation:', error);
        toaster.error({
          title: 'Erreur de réservation',
          description: error.error || error.message || 'Impossible de réserver le créneau',
        });
      }
    } catch (err) {
      frontendLog.error('Erreur réservation:', err instanceof Error ? { message: err.message, stack: err.stack } : { error: err });
      toaster.error({
        title: 'Erreur de réservation',
        description: 'Impossible de réserver le créneau: ' + (err instanceof Error ? err.message : 'Erreur inconnue'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (): void => {
    setStep('activity');
    setSelectedActivity(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setFormData(null);
  };

  const handleStepClick = (targetStep: BookingStep): void => {
    // Only allow going back to previous steps, not forward
    const currentIndex = steps.findIndex((s) => s.id === step);
    const targetIndex = steps.findIndex((s) => s.id === targetStep);
    
    if (targetIndex < currentIndex) {
      setStep(targetStep);
    }
  };

  const steps = [
    { id: 'activity', label: 'Choisissez une activité' },
    { id: 'slot', label: 'Choisissez une date et un créneau' },
    { id: 'form', label: 'Vos informations' },
    { id: 'confirm', label: 'Confirmer votre rendez-vous' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <Box maxW="800px" mx="auto" p={4}>
      <VStack gap={4} align="stretch" mb={6}>
        {step !== 'success' && (
          <HStack gap={6} justify="center" align="flex-start">
            {steps.map((s, index) => (
              <HStack key={s.id} gap={0} align="flex-start">
                <VStack gap={1} align="center">
                  <Box
                    w={8}
                    h={8}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                    fontSize="sm"
                    bg={
                      index <= currentStepIndex
                        ? `${themeColor}.solid`
                        : 'gray.200'
                    }
                    color={index <= currentStepIndex ? 'white' : 'gray.800'}
                    _dark={{
                      bg:
                        index <= currentStepIndex
                          ? `${themeColor}.solid`
                          : 'gray.700',
                      color: index <= currentStepIndex ? 'white' : 'gray.200',
                    }}
                    cursor={index <= currentStepIndex && index !== currentStepIndex ? 'pointer' : 'default'}
                    onClick={() => handleStepClick(s.id as BookingStep)}
                    _hover={index <= currentStepIndex && index !== currentStepIndex ? { bg: index <= currentStepIndex ? `${themeColor}.emphasized` : `${themeColor}.solid` } : {}}
                  >
                    {index + 1}
                  </Box>
                  <Text
                    fontSize="xs"
                    color={index <= currentStepIndex ? 'gray.800' : 'gray.400'}
                    _dark={{
                      color: index <= currentStepIndex ? 'gray.200' : 'gray.500',
                    }}
                    textAlign="center"
                    maxW="100px"
                  >
                    {s.label}
                  </Text>
                </VStack>
                {index < steps.length - 1 && (
                  <Box alignSelf="center" display="flex" alignItems="center">
                    <FiArrowRight
                      color={
                        index < currentStepIndex ? `${themeColor}.solid` : 'gray.400'
                      }
                    />
                  </Box>
                )}
              </HStack>
            ))}
          </HStack>
        )}
      </VStack>

      {step === 'activity' && (
        <ActivitySelector
          onSelect={handleActivitySelect}
          selectedActivityId={selectedActivity?.id}
        />
      )}

      {step === 'slot' && selectedActivity && (
        <SlotPicker
          activityId={selectedActivity.id}
          onSelect={handleSlotSelect}
          selectedDate={selectedDate || undefined}
          selectedSlot={selectedSlot || undefined}
          themeColor={themeColor}
        />
      )}

      {step === 'form' && selectedActivity && selectedDate && selectedSlot && (
        <BookingForm
          activity={selectedActivity}
          date={selectedDate}
          slot={selectedSlot}
          onSuccess={handleFormSubmit}
        />
      )}

      {step === 'confirm' && selectedActivity && selectedDate && selectedSlot && formData && (
        <VStack gap={4} align="stretch">
          <Box p={4} bg={`${themeColor}.muted`} _dark={{ bg: `${themeColor}.muted` }} borderRadius="md">
            <VStack gap={2} align="start">
              <Text fontWeight="semibold" fontSize="sm">{selectedActivity.name}</Text>
              <Text fontSize="sm">
                {selectedDate.toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}{' '}
                {selectedSlot.startTime.substring(11, 16)} - {selectedSlot.endTime.substring(11, 16)}
                {' '} ({selectedActivity.durationMinutes} min)
              </Text>
              {selectedActivity.price && selectedActivity.price > 0 && (
                <Text fontWeight="semibold" fontSize="sm">{selectedActivity.price.toFixed(2)} €</Text>
              )}
            </VStack>
          </Box>

          <Box p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="md">
            <VStack gap={2} align="start">
              <Text fontWeight="semibold" fontSize="sm">Vos informations</Text>
              <Text fontSize="sm">Nom: {formData.name}</Text>
              <Text fontSize="sm">Email: {formData.email}</Text>
              {formData.phone && selectedActivity.requiredFields?.fields.includes('phone') && (
                <Text fontSize="sm">Téléphone: {formData.phone}</Text>
              )}
              {formData.address && selectedActivity.requiredFields?.fields.includes('address') && (
                <Text fontSize="sm">Adresse: {formData.address}</Text>
              )}
              {formData.customFieldValue && selectedActivity.requiredFields?.fields.includes('custom') && (
                <Text fontSize="sm">
                  {selectedActivity.requiredFields?.customFieldLabel || 'Information complémentaire'}:{' '}
                  {formData.customFieldValue}
                </Text>
              )}
            </VStack>
          </Box>

          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              colorPalette={themeColor}
              onClick={handleConfirmBooking}
              loading={isSubmitting}
              width="full"
              maxW="400px"
            >
              Confirmer le rendez-vous
            </Button>
          </Box>
        </VStack>
      )}

      {step === 'success' && (
        <VStack gap={4} py={8} textAlign="center">
          <Box
            fontSize="4xl"
            color="green.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FiCheck />
          </Box>
          <Heading as="h4" size="lg" fontWeight="semibold">Rendez-vous confirmé !</Heading>
          <Box color="gray.600" _dark={{ color: 'gray.400' }}>
            Vous recevrez un email de confirmation avec les détails de votre
            rendez-vous.
          </Box>
          <Button
            mt={4}
            colorPalette={themeColor}
            onClick={handleReset}
            size="lg"
          >
            Prendre un autre rendez-vous
          </Button>
        </VStack>
      )}
    </Box>
  );
}
