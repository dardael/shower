# Agent Guidelines for Shower Project

## Goal

This project aims to create a robust, scalable, and maintainable web application using modern technologies and best practice.

- It's designed to allow the user to create it's showcase website in a simple and efficient way.
- The is an admin screen protected by authentication, and a public screen to display the showcase.
- The user can create it's pages, add sections to the pages, and customize the sections with different components.
- The user can also manage the website settings, such as the theme color, navigation, and footer.

Since this project is in creation, no need to handle backward compatibility.

## Nextjs

- **App Router** Use the app directory structure and follow the conventions for routing, layouts, and metadata.
- **Data fetching** Use Next.js API routes and avoid server actions.

## Architecture

This project must follow SOLID principles, DDD architecture, Hexagonal architecture.

Here the current tree structure to follow :

```
shower/
├── src/
│   ├── app/                  # Next.js App Router (API routes and pages)
│   │   ├── admin/
│   │   │   ├── layout.tsx             -> Admin layout component
│   │   │   ├── page.tsx              -> Route `/admin` (redirects to first section)
│   │   │   ├── social-networks/
│   │   │   │   └── page.tsx          -> Route `/admin/social-networks`
│   │   │   └── website-settings/
│   │   │       └── page.tsx          -> Route `/admin/website-settings`
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...all]/
│   │   │   │       └── route.ts      -> BetterAuth API handler
│   │   │   ├── icons/
│   │   │   │   └── [filename]/
│   │   │   │       └── route.ts      -> Icon serving endpoint
│   │   │   ├── settings/
│   │   │   │   ├── icon/
│   │   │   │   │   └── route.ts      -> Website icon API
│   │   │   │   ├── name/
│   │   │   │   │   └── route.ts      -> Website name API
│   │   │   │   ├── social-networks/
│   │   │   │   │   └── route.ts      -> Social networks API
│   │   │   │   └── route.ts          -> General settings API
│   │   │   └── test/
│   │   │       └── auth/
│   │   │           └── route.ts      -> Test authentication endpoint
│   │   ├── globals.css               -> Global styles
│   │   ├── layout.tsx                -> Root layout component
│   │   └── page.tsx                  -> Home page route `/`
│   ├── presentation/         # Presentation Layer (React components)
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   │   ├── AdminLayout.tsx -> Admin layout wrapper with sidebar state management
│   │   │   │   ├── AdminSidebar.tsx -> Collapsible sidebar navigation component
│   │   │   │   ├── AdminMenuItem.tsx -> Individual navigation menu item component
│   │   │   │   ├── AdminErrorBoundary.tsx -> Error boundary for admin pages
│   │   │   │   ├── NotAuthorized.tsx -> Unauthorized access component
│   │   │   │   ├── SocialNetworksForm.tsx -> Social networks management form
│   │   │   │   ├── ThemeColorSelector.tsx -> Theme color selection component
│   │   │   │   └── WebsiteSettingsForm.tsx -> Website settings management form
│   │   │   └── hooks/
│   │   └── shared/
│   │       ├── components/
│   │       │   ├── ImageManager/
│   │       │   │   ├── ImageManager.tsx -> Image upload/management component
│   │       │   │   └── types.ts        -> Image manager types
│   │       │   ├── ui/
│   │       │   │   ├── color-mode.tsx -> Color mode provider
│   │       │   │   ├── provider.tsx   -> UI provider wrapper
│   │       │   │   ├── toaster.tsx    -> Toast notification component
│   │       │   │   └── tooltip.tsx    -> Tooltip component
│   │       │   ├── DarkModeToggle.tsx  -> Dark mode toggle button
│   │       │   ├── ErrorBoundary.tsx   -> Global error boundary
│   │       │   ├── LoginButton.tsx     -> Login button component
│   │       │   ├── LogoutButton.tsx    -> Logout button component
│   │       │   └── SaveButton.tsx      -> Save button component
│   │       └── theme.ts                -> Chakra UI theme configuration
│   │   └── DynamicThemeProvider.tsx -> Dynamic theme provider component
│   ├── domain/               # Domain Layer (entities, business rules)
│   │   ├── auth/
│   │   │   ├── entities/
│   │   │   ├── services/
│   │   │   └── value-objects/
│   │   ├── settings/
│   │   │   ├── constants/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   └── value-objects/
│   │   └── shared/
│   │       ├── services/
│   │       │   ├── EnhancedLogFormatterService.ts -> Enhanced log formatting service
│   │       │   └── LogFormatterService.ts -> Log formatting service
│   │       └── value-objects/
│   │           └── LogLevel.ts -> Log level value object
│   ├── application/          # Application Layer (use-cases, services)
│   │   ├── auth/
│   │   │   ├── services/
│   │   ├── settings/
│   │   └── shared/
│   │       ├── ContextualLogger.ts -> Contextual logging service
│   │       ├── ILogger.ts -> Logger interface
│   │       ├── Logger.ts -> Main logger implementation
│   │       └── PerformanceMonitor.ts -> Performance monitoring service
│   ├── infrastructure/       # Infrastructure Layer (adapters, database)
│   │   ├── auth/
│   │   │   ├── adapters/
│   │   ├── settings/
│   │   │   ├── models/
│   │   │   └── repositories/
│   │   ├── shared/
│   │   │   ├── adapters/
│   │   │   │   └── FileLoggerAdapter.ts -> File logger adapter
│   │   │   ├── middleware/
│   │   │   │   └── requestContext.ts -> Request context middleware
│   │   │   ├── services/
│   │   │   │   ├── FileStorageService.ts -> File storage service
│   │   │   │   └── LogRotationService.ts -> Log rotation service
│   │   │   ├── utils/
│   │   │   │   └── filenameSanitizer.ts -> Filename sanitizer utility
│   │   │   ├── databaseConnection.ts -> Database connection configuration
│   │   │   ├── databaseInitialization.ts -> Database initialization
│   │   │   └── layoutUtils.ts -> Layout utilities for database initialization and route detection
│   │   ├── container.ts -> Dependency injection container
├── test/                     # Test Layer
│   ├── e2e/                  # End-to-end tests
│   │   ├── admin/
│   │   ├── fixtures/
│   │   │   ├── authHelpers.ts -> Authentication test helpers
│   │   │   └── test-database.ts -> Test database setup
│   │   ├── global-setup.ts -> Global e2e test setup
│   │   └── tsconfig.json -> E2E test TypeScript configuration
│   ├── unit/                 # Unit tests (following same structure as src)
│   │   ├── application/
│   │   │   ├── auth/
│   │   │   ├── settings/
│   │   │   └── shared/
│   │   ├── domain/
│   │   │   ├── auth/
│   │   │   │   └── value-objects/
│   │   │   ├── settings/
│   │   │   │   ├── entities/
│   │   │   │   ├── services/
│   │   │   │   └── value-objects/
│   │   │   └── shared/
│   │   │       ├── services/
│   │   │       └── value-objects/
│   │   ├── infrastructure/
│   │   │   ├── settings/
│   │   │   │   └── repositories/
│   │   │   └── shared/
│   │   │       ├── adapters/
│   │   │       └── services/
│   │   ├── performance/
│   │   ├── app/
│   │   │   └── admin/
│   │   ├── presentation/
│   │   │   ├── admin/
│   │   │   │   ├── components/
│   │   │   │   └── hooks/
│   │   │   └── shared/
│   │   │       └── components/
│   │   │           ├── ImageManager/
│   │   ├── jest-globals.d.ts -> Jest global type definitions
│   │   ├── setup.ts -> Unit test setup
│   │   ├── tsconfig.json -> Unit test TypeScript configuration
│   │   └── types.d.ts -> Test type definitions
├── .dockerignore
├── .env
├── .env.test
├── .gitignore
├── .husky/
│   ├── pre-commit
│   └── pre-push
├── .opencode/
│   └── rules/
│       ├── 01-standards/
│       ├── 03-frameworks-and-libraries/
│       └── 07-quality-assurance/
├── .prettierignore
├── .prettierrc.js
├── AGENTS.md
├── doc/
│   ├── functionnal.md
│   └── technical.md
├── Dockerfile
├── docker-compose.yml
├── eslint.config.mjs
├── jest.config.js
├── middleware.ts
├── next.config.ts
├── opencode.json
├── package-lock.json
├── package.json
├── playwright.config.ts
├── README.md
└── tsconfig.json


## Commands

you must use docker compose to run all commands in order to have the same environment for everyone.

**IMPORTANT**: Agents must NOT launch `docker compose run --rm app npm run dev`. If these commands are needed, the agent must ask the user to run them manually.

- **Launch server**: `docker compose up app`
- **Install**: `docker compose run --rm app npm install`
- **Build**: `docker compose run --rm app npm run build` (Next.js with Turbopack)
- **Lint**: `docker compose run --rm app npm run lint` (ESLint with Next.js, TypeScript, Prettier)
- **Format**: `docker compose run --rm app npm run format` (Prettier)
- **Type Check**: `docker compose run --rm app npm run build:strict` (TypeScript strict mode)
- **e2etests**: `docker compose run --rm -T app npm run test:e2e` (Playwright - requires MongoDB and build)
- **Test All**: `docker compose run --rm app npm run test` (Jest with ts-jest)
- **Single Test**: `docker compose run --rm app npm run test -- tests/file.test.ts` or `docker compose run --rm app npm run test -- --testNamePattern="pattern"`

## E2E Test Prerequisites

Before running e2e tests, you must complete these steps in order:

1. **Start MongoDB service**: `docker compose up mongodb -d`
2. **Build the application**: `docker compose run --rm app npm run build`
3. **Run e2e tests**: `docker compose run --rm -T app npm run test:e2e`

This ensures MongoDB is available for database operations and the application is properly built before Playwright tests execute, preventing timeouts in the opencode environment.

## Github

**User**: dardael
**repo**: shower
```
