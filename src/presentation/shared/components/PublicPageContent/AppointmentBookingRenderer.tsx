'use client';

import React from 'react';
import { Box } from '@chakra-ui/react';
import { BookingWidget } from '@/presentation/public/components/appointment/BookingWidget';
import { useBackgroundColorContext } from '@/presentation/shared/contexts/BackgroundColorContext';

export function AppointmentBookingRenderer(): React.ReactElement {
  const { backgroundColor } = useBackgroundColorContext();

  return (
    <Box borderRadius="lg" p={4} bg={backgroundColor}>
      <BookingWidget />
    </Box>
  );
}
