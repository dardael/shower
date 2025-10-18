# Shower

A Next.js application for creating showcase websites with admin authentication.

This project uses modern technologies including Next.js 15, TypeScript, Chakra UI, and follows Domain-Driven Design (DDD) and Hexagonal Architecture principles.

## Getting Started

First, run the development server:

```bash
docker compose run --rm app npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Architecture

This project follows **Domain-Driven Design (DDD)** and **Hexagonal Architecture**:

- **Domain Layer**: Business logic and entities (`src/domain/`)
- **Application Layer**: Use cases and services (`src/application/`)
- **Infrastructure Layer**: Adapters and external integrations (`src/infrastructure/`)
- **Presentation Layer**: UI components and routes (`src/presentation/`)

Key technologies:

- **Authentication**: BetterAuth with Google OAuth
- **Dependency Injection**: Tsyringe
- **Styling**: Chakra UI
- **Testing**: Jest for unit tests, Playwright for integration tests

## Project Structure

```
shower/
├── src/
│   ├── presentation/     # UI components and Next.js routes
│   ├── domain/          # Business logic and entities
│   ├── application/     # Use cases and application services
│   ├── infrastructure/  # Adapters and external services
│   └── shared/          # Shared utilities and components
├── test/
│   ├── unit/            # Unit tests
│   └── e2e/     # End-to-end tests
├── doc/                 # Documentation
└── public/              # Static assets
```

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
   BETTERAUTH_SECRET=your-random-secret-string
   ```

3. **Access the admin page:**
   - Start the development server.
   - Navigate to `/admin`.
   - You will be redirected to Google for authentication.
   - Only the specified admin email can log in and access the page.
   - Note: The Google OAuth flow is configured to always prompt for consent, ensuring users must explicitly reauthenticate after signing out.

## Testing

### Unit Tests

Run unit tests with Jest:

```bash
docker compose run --rm app npm test
```

### Integration Tests

Run end-to-end tests with Playwright:

```bash
docker compose run --rm app npm run test:e2e
```

Run with UI mode for debugging:

```bash
docker compose run --rm app npm run test:e2e:ui
```

### Git Hooks

This project uses Husky for git hooks:

- **Pre-commit**: Runs linting, formatting, and TypeScript checks
- **Pre-push**: Runs unit tests and build

## Commands Summary

| Command                                        | Description               |
| ---------------------------------------------- | ------------------------- |
| `docker compose run --rm app npm install`      | install npm lib           |
| `docker compose run --rm app npm run dev`      | Start development server  |
| `docker compose run --rm app npm run build`    | Build for production      |
| `docker compose run --rm app npm run start`    | Start production server   |
| `docker compose run --rm app npm run lint`     | Run ESLint                |
| `docker compose run --rm app npm run format`   | Format code with Prettier |
| `docker compose run --rm app npm test`         | Run unit tests            |
| `docker compose run --rm app npm run test:e2e` | Run integration tests     |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Code Formatting

This project uses Prettier for code formatting.

To format the code, run:

```bash
docker compose run --rm app npm run format
```

To check if the code is formatted correctly, run:

```bash
docker compose run --rm app npm run check-format
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Environment Variables

Make sure to set the following environment variables in your Vercel project settings:

- `ADMIN_EMAIL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `BETTERAUTH_SECRET`
- `BETTERAUTH_URL` (your deployment URL)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
