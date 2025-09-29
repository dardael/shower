import LogoutButton from '@/presentation/shared/components/LogoutButton';

export default function NotAuthorized() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-red-600">Not Authorized</h1>
      <p className="mt-4">You do not have permission to access this page.</p>
      <div className="mt-4">
        <LogoutButton />
      </div>
    </div>
  );
}
