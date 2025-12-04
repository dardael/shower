import { Container, Box, VStack, Heading, Text } from '@chakra-ui/react';
import PublicPageContent from '@/presentation/shared/components/PublicPageContent/PublicPageContent';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import { container } from '@/infrastructure/container';
import type { GetMenuItems } from '@/application/menu/GetMenuItems';
import type { GetPageContent } from '@/application/pages/use-cases/GetPageContent';

export default async function Home() {
  await DatabaseConnection.getInstance().connect();

  const getMenuItems = container.resolve<GetMenuItems>('IGetMenuItems');
  const menuItems = await getMenuItems.execute();

  if (menuItems.length === 0) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack gap={4} textAlign="center">
          <Heading as="h2" size="lg">
            No Content Available
          </Heading>
          <Text fontSize="md">
            Please add your first menu item to get started.
          </Text>
        </VStack>
      </Container>
    );
  }

  const firstMenuItem = menuItems[0];

  const getPageContent = container.resolve<GetPageContent>('IGetPageContent');
  const pageContent = await getPageContent.execute(firstMenuItem.id);

  return (
    <Container maxW="container.lg" py={8}>
      <Box>
        <PublicPageContent content={pageContent?.content.value || ''} />
      </Box>
    </Container>
  );
}
