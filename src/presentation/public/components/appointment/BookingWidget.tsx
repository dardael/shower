'use client';

import React, { Fragment, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FiCheck, FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiMapPin, FiInfo } from 'react-icons/fi';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import { toaster } from '@/presentation/shared/components/ui/toaster';
import { ActivitySelector } from './ActivitySelector';
import { SlotPicker } from './SlotPicker';
import { BookingForm } from './BookingForm';
import { frontendLog } from '@/infrastructure/shared/services/FrontendLog';
import type { Activity, TimeSlot } from '@/presentation/shared/types/appointment';

type BookingStep = 'activity' | 'slot' | 'form' | 'confirm' | 'success';

const STEPS: { id: BookingStep; label: string; shortLabel: string }[] = [
  { id: 'activity', label: 'Activité', shortLabel: 'Activité' },
  { id: 'slot', label: 'Créneau', shortLabel: 'Créneau' },
  { id: 'form', label: 'Informations', shortLabel: 'Infos' },
  { id: 'confirm', label: 'Confirmation', shortLabel: 'Confirm.' },
];

interface StepIndicatorProps {
  steps: typeof STEPS;
  currentStep: BookingStep;
  onStepClick: (step: BookingStep) => void;
  themeColor: string;
}

function StepIndicator({ steps, currentStep, onStepClick, themeColor }: StepIndicatorProps): React.ReactElement {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <Box
      px={{ base: 4, md: 8 }}
      py={4}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
      _dark={{ borderColor: 'whiteAlpha.100' }}
    >
      <HStack justify="center" align="flex-start" gap={0} maxW="480px" mx="auto" w="full">
        {steps.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = index === currentIndex;
          const isClickable = isDone;

          return (
            <Fragment key={step.id}>
              {/* Step circle + label */}
              <Box
                flex="none"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
                cursor={isClickable ? 'pointer' : 'default'}
                onClick={() => isClickable && onStepClick(step.id)}
                opacity={!isActive && !isDone ? 0.4 : 1}
                transition="opacity 0.2s"
                minW={{ base: 10, md: 12 }}
              >
                <Box
                  w={{ base: 7, md: 8 }}
                  h={{ base: 7, md: 8 }}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  fontWeight="bold"
                  transition="all 0.3s"
                  bg={
                    isDone
                      ? `${themeColor}.solid`
                      : isActive
                      ? `${themeColor}.solid`
                      : 'whiteAlpha.200'
                  }
                  color={isDone || isActive ? 'white' : 'fg'}
                  boxShadow={isActive ? `0 0 0 3px var(--chakra-colors-${themeColor}-subtle)` : 'none'}
                >
                  {isDone ? (
                    <>
                      <FiCheck size={12} aria-hidden="true" />
                      <Text srOnly>{index + 1}</Text>
                    </>
                  ) : (
                    <Box as="span" fontSize="xs" fontWeight="bold" lineHeight="1">{index + 1}</Box>
                  )}
                </Box>
                <Text
                  fontSize={{ base: '9px', md: 'xs' }}
                  fontWeight={isActive ? 'semibold' : 'normal'}
                  color={isActive ? `${themeColor}.solid` : 'fg.muted'}
                  whiteSpace="nowrap"
                >
                  <Box as="span" display={{ base: 'none', sm: 'inline' }}>{step.label}</Box>
                  <Box as="span" display={{ base: 'inline', sm: 'none' }}>{step.shortLabel}</Box>
                </Text>
              </Box>

              {/* Connector line between circles — mt aligns with circle center (circle h=32px → 16px - 1px) */}
              {index < steps.length - 1 && (
                <Box
                  flex={1}
                  h="2px"
                  mt={{ base: '13px', md: '15px' }}
                  bg={isDone ? `${themeColor}.solid` : 'gray.200'}
                  _dark={{ bg: isDone ? `${themeColor}.solid` : 'whiteAlpha.200' }}
                  borderRadius="full"
                  transition="background 0.3s"
                />
              )}
            </Fragment>
          );
        })}
      </HStack>
    </Box>
  );
}

export function BookingWidget(): React.ReactElement {
  const { themeColor } = useThemeColorContext();
  const [step, setStep] = useState<BookingStep>('activity');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    customFieldValue: string;
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
    phone: string;
    address: string;
    customFieldValue: string;
  }): void => {
    setFormData(data);
    setStep('confirm');
  };

  const handleConfirmBooking = async (): Promise<void> => {
    if (!selectedActivity || !selectedDate || !selectedSlot || !formData) return;

    setIsSubmitting(true);
    try {
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
              phone: formData.phone || undefined,
              address: formData.address || undefined,
              customField: formData.customFieldValue || undefined,
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
      frontendLog.error('Erreur réservation:', err instanceof Error ? { message: err.message } : { error: err });
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
    const currentIndex = STEPS.findIndex((s) => s.id === step);
    const targetIndex = STEPS.findIndex((s) => s.id === targetStep);
    if (targetIndex < currentIndex) setStep(targetStep);
  };

  // Glassmorphism container matching header/footer style
  return (
    <Box
      maxW="860px"
      mx="auto"
      borderRadius={{ base: 'xl', md: '2xl' }}
      overflow="hidden"
      backdropFilter="blur(24px) saturate(200%)"
      style={{ WebkitBackdropFilter: 'blur(24px) saturate(200%)' }}
      bg="whiteAlpha.700"
      border="1px solid"
      borderColor="whiteAlpha.400"
      _dark={{ bg: 'blackAlpha.500', borderColor: 'whiteAlpha.100' }}
      boxShadow="0 8px 32px rgba(0,0,0,0.10)"
    >
      {/* Steps indicator */}
      {step !== 'success' && (
        <StepIndicator
          steps={STEPS}
          currentStep={step}
          onStepClick={handleStepClick}
          themeColor={themeColor}
        />
      )}

      {/* Content area */}
      <Box p={{ base: 4, md: 8 }}>
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
          <ConfirmStep
            activity={selectedActivity}
            date={selectedDate}
            slot={selectedSlot}
            formData={formData}
            themeColor={themeColor}
            isSubmitting={isSubmitting}
            onConfirm={handleConfirmBooking}
          />
        )}

        {step === 'success' && (
          <SuccessStep themeColor={themeColor} onReset={handleReset} />
        )}
      </Box>
    </Box>
  );
}

// ─── Confirm step ────────────────────────────────────────────────────────────

interface ConfirmStepProps {
  activity: Activity;
  date: Date;
  slot: TimeSlot;
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    customFieldValue: string;
  };
  themeColor: string;
  isSubmitting: boolean;
  onConfirm: () => void;
}

function ConfirmStep({
  activity,
  date,
  slot,
  formData,
  themeColor,
  isSubmitting,
  onConfirm,
}: ConfirmStepProps): React.ReactElement {
  return (
    <VStack gap={5} align="stretch">

      {/* Appointment summary card */}
      <Box
        borderRadius="xl"
        border="1px solid"
        borderColor={`${themeColor}.subtle`}
        overflow="hidden"
      >
        {/* Colored header band */}
        <Box
          px={5}
          py={3}
          bg={`${themeColor}.subtle`}
          borderBottom="1px solid"
          borderColor={`${themeColor}.subtle`}
        >
          <Text fontWeight="400" letterSpacing="0.01em" fontSize="md">{activity.name}</Text>
        </Box>

        <Box px={5} py={4}>
          <VStack align="start" gap={4}>
            <HStack gap={3}>
              <Icon color={`${themeColor}.solid`} flexShrink={0}><FiCalendar /></Icon>
              <Text as="span" fontSize="sm">
                {date.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </HStack>
            <HStack gap={3}>
              <Icon color={`${themeColor}.solid`} flexShrink={0}><FiClock /></Icon>
              <Text as="span" fontSize="sm">
                {slot.startTime.substring(11, 16)} – {slot.endTime.substring(11, 16)}
                {' '}({activity.durationMinutes} min)
              </Text>
            </HStack>
            {activity.price && activity.price > 0 && (
              <HStack gap={3}>
                <Icon flexShrink={0} opacity={0} aria-hidden><FiClock /></Icon>
                <Text as="span" fontSize="sm" fontWeight="semibold">{activity.price.toFixed(2)} €</Text>
              </HStack>
            )}
          </VStack>
        </Box>
      </Box>

      {/* Client info card */}
      <Box
        borderRadius="xl"
        border="1px solid"
        borderColor="whiteAlpha.300"
        _dark={{ borderColor: 'whiteAlpha.100', bg: 'blackAlpha.300' }}
        px={5}
        py={4}
      >
        <Text as="span" fontWeight="400" letterSpacing="0.01em" fontSize="sm" color="fg.muted" mb={5} display="block">
          Vos informations
        </Text>
        <VStack align="start" gap={4}>
          <HStack gap={3}>
            <Icon color={`${themeColor}.solid`} flexShrink={0}><FiUser /></Icon>
            <Text as="span" fontSize="sm">{formData.name}</Text>
          </HStack>
          <HStack gap={3}>
            <Icon color={`${themeColor}.solid`} flexShrink={0}><FiMail /></Icon>
            <Text as="span" fontSize="sm">{formData.email}</Text>
          </HStack>
          {formData.phone && activity.requiredFields?.fields.includes('phone') && (
            <HStack gap={3}>
              <Icon color={`${themeColor}.solid`} flexShrink={0}><FiPhone /></Icon>
              <Text as="span" fontSize="sm">{formData.phone}</Text>
            </HStack>
          )}
          {formData.address && activity.requiredFields?.fields.includes('address') && (
            <HStack gap={3}>
              <Icon color={`${themeColor}.solid`} flexShrink={0}><FiMapPin /></Icon>
              <Text as="span" fontSize="sm">{formData.address}</Text>
            </HStack>
          )}
          {formData.customFieldValue && activity.requiredFields?.fields.includes('custom') && (
            <HStack gap={3} align="start">
              <Icon color={`${themeColor}.solid`} flexShrink={0} mt="2px"><FiInfo /></Icon>
              <Text as="span" fontSize="sm">
                <Text as="span" fontWeight="medium">
                  {activity.requiredFields?.customFieldLabel || 'Information complémentaire'} :{' '}
                </Text>
                {formData.customFieldValue}
              </Text>
            </HStack>
          )}
        </VStack>
      </Box>

      <Box
        as="button"
        onClick={onConfirm}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="44px"
        px={6}
        py={2}
        borderRadius="full"
        border="1px solid"
        borderColor={{ base: `rgba(0,0,0,0.1)`, _dark: 'rgba(255,255,255,0.15)' }}
        bg={{ base: 'rgba(255,255,255,0.5)', _dark: 'rgba(255,255,255,0.06)' }}
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', width: '100%', cursor: isSubmitting ? 'wait' : 'pointer' }}
        transition="all 0.2s ease"
        _hover={{
          bg: { base: 'rgba(255,255,255,0.85)', _dark: 'rgba(255,255,255,0.12)' },
          borderColor: { base: 'rgba(0,0,0,0.2)', _dark: 'rgba(255,255,255,0.25)' },
          transform: 'translateY(-1px)',
          boxShadow: { base: '0 4px 16px rgba(0,0,0,0.1)', _dark: '0 4px 16px rgba(0,0,0,0.4)' },
        }}
        aria-label="Confirmer le rendez-vous"
        aria-busy={isSubmitting}
        fontSize="sm"
        fontWeight="400"
        letterSpacing="0.01em"
        color="fg"
      >
        {isSubmitting ? 'Confirmation en cours...' : 'Confirmer le rendez-vous'}
      </Box>
    </VStack>
  );
}

// ─── Success step ─────────────────────────────────────────────────────────────

interface SuccessStepProps {
  themeColor: string;
  onReset: () => void;
}

function SuccessStep({ themeColor, onReset }: SuccessStepProps): React.ReactElement {
  return (
    <VStack gap={6} py={{ base: 8, md: 12 }} textAlign="center" align="center">
      {/* Animated check circle */}
      <Box
        w={20}
        h={20}
        borderRadius="full"
        bg={`${themeColor}.subtle`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        border="2px solid"
        borderColor={`${themeColor}.solid`}
      >
        <Icon color={`${themeColor}.solid`} fontSize="2xl">
          <FiCheck />
        </Icon>
      </Box>

      <VStack gap={2}>
        <Text color="fg" maxW="360px" fontSize="sm" fontWeight="400" letterSpacing="0.01em">
          Un email de confirmation avec les détails de votre rendez-vous vous sera envoyé prochainement.
        </Text>
      </VStack>

      <Box
        as="button"
        onClick={onReset}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="44px"
        px={6}
        py={2}
        borderRadius="full"
        border="1px solid"
        borderColor={{ base: 'rgba(0,0,0,0.1)', _dark: 'rgba(255,255,255,0.15)' }}
        bg={{ base: 'rgba(255,255,255,0.5)', _dark: 'rgba(255,255,255,0.06)' }}
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', cursor: 'pointer' }}
        transition="all 0.2s ease"
        _hover={{
          bg: { base: 'rgba(255,255,255,0.85)', _dark: 'rgba(255,255,255,0.12)' },
          borderColor: { base: 'rgba(0,0,0,0.2)', _dark: 'rgba(255,255,255,0.25)' },
          transform: 'translateY(-1px)',
          boxShadow: { base: '0 4px 16px rgba(0,0,0,0.1)', _dark: '0 4px 16px rgba(0,0,0,0.4)' },
        }}
        aria-label="Prendre un autre rendez-vous"
      >
        <Text as="span" fontSize="sm" fontWeight="400" letterSpacing="0.01em" color="fg">
          Prendre un autre rendez-vous
        </Text>
      </Box>
    </VStack>
  );
}
