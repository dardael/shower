import { Container, Heading, Text, Stack, HStack } from '@chakra-ui/react';
import LogoutButton from '@/presentation/shared/components/LogoutButton';
import DarkModeToggle from '@/presentation/shared/components/DarkModeToggle';
import WebsiteSettingsForm from './WebsiteSettingsForm';

interface AdminDashboardProps {
  initialWebsiteName: string;
}

export default function AdminDashboard({
  initialWebsiteName,
}: AdminDashboardProps) {
  return (
    <Container maxW="container.lg" p={4}>
      <Stack gap={4}>
        <HStack justify="space-between" align="center">
          <Heading
            as="h1"
            size="xl"
            color={{ base: 'gray.900', _dark: 'white' }}
          >
            Admin Dashboard
          </Heading>
          <DarkModeToggle />
        </HStack>
        <Text color={{ base: 'gray.600', _dark: 'gray.300' }}>
          Welcome to the admin area. This page is protected by Google
          authentication.
        </Text>
        <WebsiteSettingsForm initialName={initialWebsiteName} />
        <LogoutButton />
      </Stack>
    </Container>
  );
}
