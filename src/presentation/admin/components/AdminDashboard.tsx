import {
  Container,
  Heading,
  Text,
  Stack,
  HStack,
  Flex,
  Box,
  VStack,
} from '@chakra-ui/react';
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
    <Container
      maxW="container.xl"
      py={{ base: 6, md: 8 }}
      px={{ base: 4, md: 6 }}
    >
      <Stack gap={6}>
        <Flex
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 4, md: 0 }}
          pb={{ base: 4, md: 6 }}
          borderBottom="1px solid"
          borderColor="border"
          mb={2}
        >
          <VStack align="start" gap={1}>
            <Heading
              as="h1"
              size={{ base: 'xl', md: '2xl' }}
              fontWeight="bold"
              color="fg"
              letterSpacing="tight"
            >
              Admin Dashboard
            </Heading>
            <Text
              fontSize={{ base: 'sm', md: 'md' }}
              color="fg.muted"
              fontWeight="medium"
              display={{ base: 'none', sm: 'block' }}
            >
              Manage your website settings and configuration
            </Text>
          </VStack>
          <DarkModeToggle />
        </Flex>

        <Box
          bg="bg.subtle"
          borderRadius="2xl"
          p={{ base: 4, md: 6 }}
          border="1px solid"
          borderColor="border"
          mb={6}
        >
          <VStack align="start" gap={3}>
            <HStack gap={3}>
              <Box
                w="12px"
                h="12px"
                borderRadius="full"
                bg="colorPalette.solid"
                colorPalette="blue"
              />
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="semibold"
                color="fg"
              >
                Welcome back
              </Text>
            </HStack>
            <Text
              fontSize={{ base: 'sm', md: 'md' }}
              color="fg.muted"
              lineHeight="relaxed"
            >
              This protected admin area allows you to manage your website
              settings. All changes are securely authenticated and logged.
            </Text>
          </VStack>
        </Box>

        <WebsiteSettingsForm initialName={initialWebsiteName} />
        <LogoutButton />
      </Stack>
    </Container>
  );
}
