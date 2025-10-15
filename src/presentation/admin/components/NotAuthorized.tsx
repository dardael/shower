import {
  Container,
  Heading,
  Text,
  Stack,
  HStack,
  Box,
  VStack,
} from '@chakra-ui/react';
import LogoutButton from '@/presentation/shared/components/LogoutButton';
import DarkModeToggle from '@/presentation/shared/components/DarkModeToggle';

export default function NotAuthorized() {
  return (
    <Container
      maxW="container.md"
      py={{ base: 12, md: 16 }}
      px={{ base: 4, md: 6 }}
    >
      <Stack gap={6}>
        <HStack justify="space-between" align="center">
          <Heading as="h1" size="xl" color="fg" fontWeight="bold">
            Access Restricted
          </Heading>
          <DarkModeToggle />
        </HStack>

        <Box
          bg="bg.subtle"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border"
          p={{ base: 6, sm: 8, md: 10 }}
          textAlign="center"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            bg: 'colorPalette.solid',
            colorPalette: 'red',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <VStack gap={{ base: 4, md: 6 }}>
            <Box
              w={{ base: '56px', md: '64px' }}
              h={{ base: '56px', md: '64px' }}
              borderRadius="full"
              bg="colorPalette.subtle"
              colorPalette="red"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize={{ base: 'xl', md: '2xl' }}
            >
              🔒
            </Box>

            <VStack gap={3}>
              <Heading
                as="h2"
                size={{ base: 'xl', md: '2xl' }}
                fontWeight="bold"
                color="fg"
                letterSpacing="tight"
              >
                Access Restricted
              </Heading>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color="fg.muted"
                lineHeight="relaxed"
                maxW="md"
              >
                You don&apos;t have the necessary permissions to access this
                admin area. Please contact your administrator if you believe
                this is an error.
              </Text>
            </VStack>

            <LogoutButton />
          </VStack>
        </Box>
      </Stack>
    </Container>
  );
}
