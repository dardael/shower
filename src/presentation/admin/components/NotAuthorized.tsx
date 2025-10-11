import { Container, Heading, Text, Stack, HStack } from '@chakra-ui/react';
import LogoutButton from '@/presentation/shared/components/LogoutButton';
import DarkModeToggle from '@/presentation/shared/components/DarkModeToggle';

export default function NotAuthorized() {
  return (
    <Container maxW="container.lg" p={4}>
      <Stack gap={4}>
        <HStack justify="space-between" align="center">
          <Heading as="h1" size="xl" colorPalette="red">
            Not Authorized
          </Heading>
          <DarkModeToggle />
        </HStack>
        <Text color={{ base: 'gray.600', _dark: 'gray.300' }}>
          You do not have permission to access this page.
        </Text>
        <LogoutButton />
      </Stack>
    </Container>
  );
}
