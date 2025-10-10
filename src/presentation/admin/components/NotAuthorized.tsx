import LogoutButton from '@/presentation/shared/components/LogoutButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/shared/components/ui/card';
import {
  Alert,
  AlertDescription,
} from '@/presentation/shared/components/ui/alert';

export default function NotAuthorized() {
  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-destructive">
            Access Denied
          </CardTitle>
          <CardDescription>
            You do not have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
            <AlertDescription>
              This area is restricted to administrators only. Please sign in
              with an authorized account to continue.
            </AlertDescription>
          </Alert>
          <LogoutButton />
        </CardContent>
      </Card>
    </div>
  );
}
