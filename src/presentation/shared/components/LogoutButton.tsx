'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
    >
      Sign out
    </button>
  );
}
