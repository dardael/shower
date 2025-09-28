import LogoutButton from '@/presentation/shared/components/LogoutButton';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">
        Welcome to the admin area. This page is protected by Google
        authentication.
      </p>
      <div className="mt-4">
        <LogoutButton />
      </div>
    </div>
  );
}
