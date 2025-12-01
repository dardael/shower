import { notFound } from 'next/navigation';
import { Container, Box } from '@chakra-ui/react';
import PublicPageContent from '@/presentation/shared/components/PublicPageContent/PublicPageContent';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import { container } from '@/infrastructure/container';
import type { GetMenuItems } from '@/application/menu/GetMenuItems';
import type { GetPageContent } from '@/application/pages/use-cases/GetPageContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const slugWithSlash = slug.startsWith('/') ? slug : `/${slug}`;
  const slugWithoutSlash = slug.startsWith('/') ? slug.slice(1) : slug;

  await DatabaseConnection.getInstance().connect();

  const getMenuItems = container.resolve<GetMenuItems>('IGetMenuItems');
  const menuItems = await getMenuItems.execute();

  const menuItem = menuItems.find(
    (item) =>
      item.url.value === slugWithSlash || item.url.value === slugWithoutSlash
  );

  if (!menuItem) {
    notFound();
  }

  const getPageContent = container.resolve<GetPageContent>('IGetPageContent');
  const pageContent = await getPageContent.execute(menuItem.id);

  return (
    <Container maxW="container.lg" py={8}>
      <Box>
        <PublicPageContent content={pageContent?.content.value || ''} />
      </Box>
    </Container>
  );
}
