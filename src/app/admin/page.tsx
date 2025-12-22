import { redirect } from 'next/navigation';
import { AdminPageAuthenticator } from '@/infrastructure/auth/AdminPageAuthenticator';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import { VStack, Heading, Box, AbsoluteCenter, Text } from '@chakra-ui/react';
import LoginButton from '@/presentation/shared/components/LoginButton';
import NotAuthorized from '@/presentation/admin/components/NotAuthorized';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AdminPage() {
  const authenticator = new AdminPageAuthenticator();
  const effectiveSession = await authenticator.getSession();

  if (!effectiveSession || !effectiveSession.user?.email) {
    return (
      <Box
        position="relative"
        height="100vh"
        width="100%"
        bg="bg.canvas"
        bgGradient={{
          base: 'radial-gradient(circle at 20% 80%, blue.50 0%, transparent 50%), radial-gradient(circle at 80% 20%, purple.50 0%, transparent 50%), linear-gradient(135deg, gray.50 0%, white 100%)',
          _dark:
            'radial-gradient(circle at 20% 80%, blue.900 0%, transparent 50%), radial-gradient(circle at 80% 20%, purple.900 0%, transparent 50%), linear-gradient(135deg, gray.900 0%, black 100%)',
        }}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
          pointerEvents: 'none',
        }}
      >
        <AbsoluteCenter>
          <Box
            bg="bg.subtle"
            borderRadius="3xl"
            border="1px solid"
            borderColor="border"
            boxShadow={{
              base: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              _dark:
                '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}
            padding={{ base: 6, sm: 8, md: 10 }}
            width={{ base: '95%', sm: '90%', md: '480px' }}
            maxWidth="90%"
            position="relative"
            _after={{
              content: '""',
              position: 'absolute',
              top: -1,
              left: -1,
              right: -1,
              bottom: -1,
              bg: 'linear-gradient(135deg, blue.500, purple.500)',
              borderRadius: '3xl',
              zIndex: -1,
              opacity: 0.1,
            }}
          >
            <VStack gap={{ base: 4, md: 6 }}>
              <Heading
                as="h1"
                size={{ base: '2xl', md: '3xl' }}
                fontWeight="bold"
                color="fg"
                textAlign="center"
                letterSpacing="tight"
              >
                Connexion
              </Heading>
              <Heading
                size={{ base: 'md', md: 'lg' }}
                fontWeight="medium"
                color="fg.muted"
                textAlign="center"
                lineHeight="relaxed"
              >
                {"Accéder à l'administration du site"}
              </Heading>
              <LoginButton />
            </VStack>
          </Box>
        </AbsoluteCenter>
      </Box>
    );
  }

  const isAuthorized = effectiveSession
    ? await authenticator.isAuthorized(effectiveSession)
    : false;

  // Connect to database first to ensure Better Auth can access it
  // Add error handling for build-time scenarios
  let dbError: Error | null = null;

  try {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
  } catch (error) {
    const logger = container.resolve<Logger>('Logger');
    logger.logError('Database connection error', { error });
    dbError = error instanceof Error ? error : new Error(String(error));

    // In development environment, show a helpful error message
    if (process.env.NODE_ENV === 'development') {
      return (
        <Box
          position="relative"
          height="100vh"
          width="100%"
          bg="bg.canvas"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack gap={4} maxW="500px" textAlign="center" p={8}>
            <Heading size="lg" color="fg">
              Connexion à la base de données requise
            </Heading>
            <Text color="fg.muted">
              Le panneau d&apos;administration nécessite une connexion à la base
              de données. Veuillez vérifier :
            </Text>
            <VStack gap={2} align="start" color="fg.muted">
              <Text>• MongoDB est en cours d&apos;exécution et accessible</Text>
              <Text>
                • La variable d&apos;environnement MONGODB_URI est définie
              </Text>
              <Text>
                • Les permissions de la base de données sont configurées
                correctement
              </Text>
            </VStack>
            <Text fontSize="sm" color="fg.muted">
              Erreur : {dbError.message}
            </Text>
          </VStack>
        </Box>
      );
    }
  }

  if (isAuthorized) {
    // Redirect to first available section
    redirect('/admin/website-settings');
  } else {
    return <NotAuthorized />;
  }
}
