'use client';

import { signIn } from 'next-auth/react';

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn('google')}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      Sign in with Google
    </button>
  );
}
