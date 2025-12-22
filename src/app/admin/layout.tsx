import 'reflect-metadata';
import React from 'react';
import type { Metadata } from 'next';
import {
  initializeDatabaseForLayout,
  fetchWebsiteName,
  fetchWebsiteIcon,
} from '@/infrastructure/shared/layoutUtils';
import { Provider } from '@/presentation/shared/components/ui/provider';
import { Toaster } from '@/presentation/shared/components/ui/toaster';
import { AdminProvider } from '@/presentation/admin/components/AdminProvider';

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getAdminWebsiteName(): Promise<string> {
  return fetchWebsiteName();
}

async function getAdminWebsiteIcon(): Promise<string | null> {
  return fetchWebsiteIcon();
}

export async function generateMetadata(): Promise<Metadata> {
  const websiteName = await getAdminWebsiteName();
  const websiteIcon = await getAdminWebsiteIcon();

  return {
    title: websiteName,
    description: "Panneau d'administration du site Shower",
    icons: websiteIcon
      ? {
          icon: websiteIcon,
          shortcut: websiteIcon,
          apple: websiteIcon,
        }
      : undefined,
  };
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize database connection for admin layout
  await initializeDatabaseForLayout();

  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>
          <AdminProvider>{children}</AdminProvider>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
