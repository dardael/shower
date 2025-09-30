# Admin Page Protection - Technical Implementation

## Authentication

The application uses **NextAuth.js** with Google OAuth as the authentication provider. This ensures a secure and seamless login experience.

## Authorization

The following mechanisms are used to protect the admin page:

1. **Middleware**
   - The `middleware.ts` file includes a check to ensure that only authenticated users with a valid session token can access the `/admin` page.

2. **Server-Side Authorization**
   - During the sign-in process, the application verifies the user's email against the `ADMIN_EMAIL` environment variable. If the email does not match, access is denied.

## Environment Variables

To configure admin access, set the following environment variables in your `.env` file:

```env
ADMIN_EMAIL=your-admin-email@example.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-random-secret-string
```

---

## Additional Notes

### Middleware Implementation

## Error Type

Runtime Error

## Error Message

Event handlers cannot be passed to Client Component props.
<button onClick={function onClick} className=... children=...>
^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.

    at stringify (<anonymous>:1:18)

Next.js version: 15.5.4 (Turbopack)

## Error Type

Runtime Error

## Error Message

Event handlers cannot be passed to Client Component props.
<button onClick={function onClick} className=... children=...>
^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.

    at stringify (<anonymous>:1:18)

Next.js version: 15.5.4 (Turbopack)

- The `middleware.ts` file uses the `withAuth` function from NextAuth.js to protect the `/admin` route.
- The middleware ensures that only users with valid session tokens can proceed.

### NextAuth Configuration

- The `NextAuthHandler.ts` file contains the configuration for NextAuth.js.
- The `GoogleProvider` is configured with `prompt: 'consent'` to ensure that users explicitly reauthenticate after signing out.

### Security Best Practices

- Use a strong, random `NEXTAUTH_SECRET` to secure session tokens.
- Regularly update the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to maintain security.
- Restrict the `ADMIN_EMAIL` to trusted personnel only.

---

## Website Settings Storage

The website settings are stored in MongoDB using Mongoose. Each setting is identified by a unique `key` field, allowing multiple settings to be stored in the same collection.

### Schema

- `key`: String, required, unique - Identifies the setting type (e.g., 'name' for website name)
- `name`: String, required - The value of the setting (e.g., the website name)

### Migration

When upgrading from the previous singleton pattern, run the migration script `scripts/migrate-website-settings.js` to add the `key` field to existing documents.

---

## Summary

The technical implementation of the admin page protection combines middleware, server-side authorization, and environment variable configuration to ensure robust security and compliance with best practices.
