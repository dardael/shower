This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
docker compose run --rm npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Admin Access Setup

The `/admin` page is protected and requires Google authentication. Only users with an email address matching the `ADMIN_EMAIL` environment variable can access it.

### Setup Steps

1. **Set up Google OAuth credentials:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Enable the Google+ API.
   - Create OAuth 2.0 credentials (Client ID and Client Secret).
   - Add `http://localhost:3000/api/auth/callback/google` to the authorized redirect URIs.

2. **Configure environment variables in `.env`:**

   ```
   ADMIN_EMAIL=your-admin-email@example.com
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXTAUTH_SECRET=your-random-secret-string
   ```

3. **Access the admin page:**
   - Start the development server.
   - Navigate to `/admin`.
   - You will be redirected to Google for authentication.
   - Only the specified admin email can log in and access the page.
   - Note: The Google OAuth flow is configured to always prompt for consent, ensuring users must explicitly reauthenticate after signing out.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Code Formatting

This project uses Prettier for code formatting.

To format the code, run:

```bash
docker compose run --rm npm run format
```

To check if the code is formatted correctly, run:

```bash
docker compose run --rm npm run check-format
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
