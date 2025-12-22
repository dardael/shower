import { Suspense } from 'react';
import ConfirmationClient from './ConfirmationClient';
import { Box, Spinner } from '@chakra-ui/react';

export default function ConfirmationPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" />
        </Box>
      }
    >
      <ConfirmationClient />
    </Suspense>
  );
}
