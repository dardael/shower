import { AdminPageAuthenticator } from '@/infrastructure/auth/AdminPageAuthenticator';
import OrdersClient from './OrdersClient';

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function OrdersPage(): Promise<React.ReactElement> {
  const authenticator = new AdminPageAuthenticator();
  await authenticator.authenticate();

  return <OrdersClient />;
}
