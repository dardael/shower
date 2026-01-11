'use client';

import React from 'react';
import { Box } from '@chakra-ui/react';
import { BookingWidget } from '@/presentation/public/components/appointment/BookingWidget';
import { useBackgroundColorContext } from '@/presentation/shared/contexts/BackgroundColorContext';

interface AppointmentBookingRendererProps {
  title?: string;
}

export function AppointmentBookingRenderer({
  title,
}: AppointmentBookingRendererProps): React.ReactElement {
  const { backgroundColor } = useBackgroundColorContext();

  return (
    <Box borderRadius="lg" p={4} bg={backgroundColor}>
      {title && (
        <Box
          as="h2"
          fontSize="2xl"
          fontWeight="semibold"
          mb={4}
          textAlign="center"
        >
          {title}
        </Box>
      )}
      <BookingWidget />
    </Box>
  );
}
