import LogoutButton from '@/presentation/shared/components/LogoutButton';
import WebsiteSettingsForm from './WebsiteSettingsForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/shared/components/ui/card';
import { ThemeToggle } from '@/presentation/shared/components/theme/theme-toggle';

interface AdminDashboardProps {
  initialWebsiteName: string;
}

export default function AdminDashboard({
  initialWebsiteName,
}: AdminDashboardProps) {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the admin area. This page is protected by Google
            authentication.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Website Settings</CardTitle>
            <CardDescription>
              Configure your website&apos;s basic settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WebsiteSettingsForm initialName={initialWebsiteName} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your authentication session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LogoutButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
