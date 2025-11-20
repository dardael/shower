# Shower

A Next.js application for creating showcase websites with admin authentication.

This project uses modern technologies including Next.js 15, TypeScript, Chakra UI, and follows Domain-Driven Design (DDD) and Hexagonal Architecture principles.

## Getting Started

First, run the development server:

```bash
docker compose up app
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Architecture

This project follows **Domain-Driven Design (DDD)** and **Hexagonal Architecture**:

- **Domain Layer**: Business logic and entities (`src/domain/`)
- **Application Layer**: Use cases and services (`src/application/`)
- **Infrastructure Layer**: Adapters and external services (`src/infrastructure/`)
- **Presentation Layer**: UI components and routes (`src/presentation/`)

Key technologies:

- **Authentication**: BetterAuth with Google OAuth
- **Dependency Injection**: Tsyringe
- **Styling**: Chakra UI
- **Logging**: Simple console logging with environment-based log level filtering
- **Testing**: Jest for unit tests

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
│   │   └── performance/ # Performance tests
├── logs/                # Generated log files
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

   ```

# Admin Configuration

    ADMIN_EMAIL=your-admin-email@example.com
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    BETTERAUTH_SECRET=your-random-secret-string

    # Logging Configuration
    LOG_LEVEL=info

```

3. **Access the admin page:**
- Start the development server.
- Navigate to `/admin`.
- You will be redirected to Google for authentication.
- Only the specified admin email can log in and access the page.
- Note: The Google OAuth flow is configured to always prompt for consent, ensuring users must explicitly reauthenticate after signing out.

```
