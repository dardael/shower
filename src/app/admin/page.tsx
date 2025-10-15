import { headers } from 'next/headers';
import { auth } from '@/infrastructure/auth/BetterAuthInstance';
import { User } from '@/domain/auth/entities/User';
import {
  AuthServiceLocator,
  SettingsServiceLocator,
} from '@/infrastructure/container';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import { VStack, Heading, Box, AbsoluteCenter } from '@chakra-ui/react';
import LoginButton from '@/presentation/shared/components/LoginButton';
import AdminDashboard from '@/presentation/admin/components/AdminDashboard';
import NotAuthorized from '@/presentation/admin/components/NotAuthorized';

export default async function AdminPage() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  // Check for test authentication cookie (only in test environment)
  const cookies = headersList.get('cookie');
  const testSessionToken = cookies?.includes(
    'better-auth.session_token=test-session-token'
  );

  // For testing, if we have the test cookie, create a mock session
  let mockSession = null;
  if (process.env.SHOWER_ENV === 'test' && testSessionToken) {
    const userDataCookie = cookies?.match(/test-user-data=([^;]+)/)?.[1];
    if (userDataCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataCookie));
        mockSession = {
          user: {
            id: `test-user-${userData.email.replace(/[^a-zA-Z0-9]/g, '-')}`,
            email: userData.email,
            name: userData.isAdmin ? 'Test Admin' : 'Test User',
            image: null,
          },
          session: {
            id: 'test-session-id',
            userId: `test-user-${userData.email.replace(/[^a-zA-Z0-9]/g, '-')}`,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        };
      } catch (error) {
        console.error('Failed to parse test user data:', error);
      }
    }
  }

  const effectiveSession = session || mockSession;

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

  const user = new User(effectiveSession.user.email, true);
  const authorizeAdminAccess = AuthServiceLocator.getAuthorizeAdminAccess();
  const isAuthorized = authorizeAdminAccess.execute(user);

  // Connect to database first to ensure Better Auth can access it
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.connect();

  if (isAuthorized) {
    const getWebsiteName = SettingsServiceLocator.getWebsiteName();
    const websiteName = await getWebsiteName.execute();

    return <AdminDashboard initialWebsiteName={websiteName} />;
  } else {
    return <NotAuthorized />;
  }
}
