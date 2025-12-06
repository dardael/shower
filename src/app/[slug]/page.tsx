import { PublicPageClient } from './PublicPageClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicPage({ params }: PageProps) {
  // Extract slug from params for Next.js routing
  await params;

  // Render client component that handles loading state
  return <PublicPageClient />;
}
