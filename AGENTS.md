# Agent Guidelines for Shower Project

## Goal

This project aims to create a robust, scalable, and maintainable web application using modern technologies and best practice.

- It's designed to allow the user to create it's showcase website in a simple and efficient way.
- The is an admin screen protected by authentication, and a public screen to display the showcase.
- The user can create it's pages, add sections to the pages, and customize the sections with different components.
- The user can also manage the website settings, such as the theme color, navigation, and footer.

## Nextjs

- **React components** Use Next js server components as much as possible, only use client components when necessary (e.g. for interactivity).
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
│   │   │   └── page.tsx              -> Route `/admin`
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
│   │   │   │   ├── AdminDashboard.tsx    -> Admin dashboard component
│   │   │   │   ├── AdminErrorBoundary.tsx -> Error boundary for admin pages
│   │   │   │   ├── NotAuthorized.tsx     -> Not authorized component
│   │   │   │   ├── SocialNetworksForm.tsx -> Social networks management form
│   │   │   │   ├── ThemeColorSelector.tsx -> Theme color selector component
│   │   │   │   └── WebsiteSettingsForm.tsx -> Website settings form
│   │   │   └── hooks/
│   │   │       └── useSocialNetworksForm.ts -> Hook for social networks form
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
│   │   │   │   └── User.ts             -> User entity
│   │   │   ├── services/
│   │   │   │   └── AdminAccessPolicyService.ts -> Business rules for admin access
│   │   │   └── value-objects/
│   │   │       └── AdminAccessPolicy.ts -> Value object for admin access policy
│   │   ├── settings/
│   │   │   ├── constants/
│   │   │   │   ├── SocialNetworkConfig.ts -> Social network configuration constants
│   │   │   │   └── ThemeColorPalette.ts -> Theme color palette constants
│   │   │   ├── entities/
│   │   │   │   ├── SocialNetwork.ts   -> Social network entity
│   │   │   │   └── WebsiteSettings.ts -> Website settings entity
│   │   │   ├── repositories/
│   │   │   │   ├── SocialNetworkRepository.ts -> Social network repository interface
│   │   │   │   └── WebsiteSettingsRepository.ts -> Website settings repository interface
│   │   │   ├── services/
│   │   │   │   └── SocialNetworkValidationService.ts -> Social network validation service
│   │   │   └── value-objects/
│   │   │       ├── SocialNetworkLabel.ts -> Social network label value object
│   │   │       ├── SocialNetworkType.ts -> Social network type value object
│   │   │       ├── SocialNetworkUrl.ts -> Social network URL value object
│   │   │       ├── ThemeColor.ts -> Theme color value object
│   │   │       ├── WebsiteIcon.ts -> Website icon value object
│   │   │       └── WebsiteName.ts -> Website name value object
│   │   └── shared/
│   │       ├── services/
│   │       │   ├── EnhancedLogFormatterService.ts -> Enhanced log formatting service
│   │       │   └── LogFormatterService.ts -> Log formatting service
│   │       └── value-objects/
│   │           └── LogLevel.ts -> Log level value object
│   ├── application/          # Application Layer (use-cases, services)
│   │   ├── auth/
│   │   │   ├── services/
│   │   │   │   └── IBetterAuthClientService.ts -> BetterAuth client service interface
│   │   │   ├── AuthorizeAdminAccess.ts -> Use case for authorizing admin access
│   │   │   └── IAuthorizeAdminAccess.ts -> Interface for AuthorizeAdminAccess use case
│   │   ├── settings/
│   │   │   ├── GetSocialNetworks.ts -> Use case for getting social networks
│   │   │   ├── GetThemeColor.ts -> Use case for getting theme color
│   │   │   ├── GetWebsiteIcon.ts -> Use case for getting website icon
│   │   │   ├── GetWebsiteName.ts -> Use case for getting website name
│   │   │   ├── IGetSocialNetworks.ts -> Interface for GetSocialNetworks use case
│   │   │   ├── IGetThemeColor.ts -> Interface for GetThemeColor use case
│   │   │   ├── IGetWebsiteIcon.ts -> Interface for GetWebsiteIcon use case
│   │   │   ├── IGetWebsiteName.ts -> Interface for GetWebsiteName use case
│   │   │   ├── IUpdateSocialNetworks.ts -> Interface for UpdateSocialNetworks use case
│   │   │   ├── IUpdateThemeColor.ts -> Interface for UpdateThemeColor use case
│   │   │   ├── IUpdateWebsiteIcon.ts -> Interface for UpdateWebsiteIcon use case
│   │   │   ├── IUpdateWebsiteName.ts -> Interface for UpdateWebsiteName use case
│   │   │   ├── SocialNetworkFactory.ts -> Factory for creating social networks
│   │   │   ├── UpdateSocialNetworks.ts -> Use case for updating social networks
│   │   │   ├── UpdateThemeColor.ts -> Use case for updating theme color
│   │   │   ├── UpdateWebsiteIcon.ts -> Use case for updating website icon
│   │   │   └── UpdateWebsiteName.ts -> Use case for updating website name
│   │   └── shared/
│   │       ├── ContextualLogger.ts -> Contextual logging service
│   │       ├── ILogger.ts -> Logger interface
│   │       ├── Logger.ts -> Main logger implementation
│   │       └── PerformanceMonitor.ts -> Performance monitoring service
│   ├── infrastructure/       # Infrastructure Layer (adapters, database)
│   │   ├── auth/
│   │   │   ├── adapters/
│   │   │   │   └── BetterAuthClientAdapter.ts -> BetterAuth client adapter
│   │   │   └── BetterAuthInstance.ts -> BetterAuth instance configuration
│   │   ├── settings/
│   │   │   ├── models/
│   │   │   │   ├── SocialNetworkModel.ts -> Mongoose social network model
│   │   │   │   └── WebsiteSettingsModel.ts -> Mongoose website settings model
│   │   │   └── repositories/
│   │   │       ├── MongooseSocialNetworkRepository.ts -> Mongoose social network repository
│   │   │       └── MongooseWebsiteSettingsRepository.ts -> Mongoose website settings repository
│   │   ├── shared/
│   │   │   ├── adapters/
│   │   │   │   ├── AsyncFileLoggerAdapter.ts -> Async file logger adapter
│   │   │   │   └── FileLoggerAdapter.ts -> File logger adapter
│   │   │   ├── middleware/
│   │   │   │   └── requestContext.ts -> Request context middleware
│   │   │   ├── services/
│   │   │   │   ├── FileStorageService.ts -> File storage service
│   │   │   │   └── LogRotationService.ts -> Log rotation service
│   │   │   ├── utils/
│   │   │   │   └── filenameSanitizer.ts -> Filename sanitizer utility
│   │   │   ├── databaseConnection.ts -> Database connection configuration
│   │   │   └── databaseInitialization.ts -> Database initialization
│   │   ├── container.ts -> Dependency injection container
│   │   └── enhancedContainer.ts -> Enhanced dependency injection container
├── test/                     # Test Layer
│   ├── e2e/                  # End-to-end tests
│   │   ├── admin/
│   │   │   ├── admin-page.spec.ts -> Admin page e2e tests
│   │   │   ├── icon-management.spec.ts -> Icon management e2e tests
│   │   │   ├── social-networks-management.spec.ts -> Social networks management e2e tests
│   │   │   └── theme-color-management.spec.ts -> Theme color management e2e tests
│   │   ├── fixtures/
│   │   │   ├── authHelpers.ts -> Authentication test helpers
│   │   │   └── test-database.ts -> Test database setup
│   │   ├── global-setup.ts -> Global e2e test setup
│   │   └── tsconfig.json -> E2E test TypeScript configuration
│   ├── unit/                 # Unit tests (following same structure as src)
│   │   ├── application/
│   │   │   ├── auth/
│   │   │   │   └── AuthorizeAdminAccess.test.ts -> Admin access authorization tests
│   │   │   ├── settings/
│   │   │   │   ├── GetSocialNetworks.test.ts -> Get social networks tests
│   │   │   │   ├── GetThemeColor.test.ts -> Get theme color tests
│   │   │   │   ├── GetWebsiteIcon.test.ts -> Get website icon tests
│   │   │   │   ├── GetWebsiteName.test.ts -> Get website name tests
│   │   │   │   ├── UpdateSocialNetworks.test.ts -> Update social networks tests
│   │   │   │   ├── UpdateThemeColor.test.ts -> Update theme color tests
│   │   │   │   ├── UpdateWebsiteIcon.test.ts -> Update website icon tests
│   │   │   │   └── UpdateWebsiteName.test.ts -> Update website name tests
│   │   │   └── shared/
│   │   │       ├── Logger.test.ts -> Logger implementation tests
│   │   │       ├── PerformanceMonitor.test.ts -> Performance monitor tests
│   │   │       └── enhanced-logging-components.test.ts -> Enhanced logging tests
│   │   ├── domain/
│   │   │   ├── auth/
│   │   │   │   └── value-objects/
│   │   │   │       └── AdminAccessPolicy.test.ts -> Admin access policy tests
│   │   │   ├── settings/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── SocialNetwork.test.ts -> Social network entity tests
│   │   │   │   │   └── WebsiteSettings.test.ts -> Website settings entity tests
│   │   │   │   ├── services/
│   │   │   │   │   └── SocialNetworkValidationService.test.ts -> Social network validation tests
│   │   │   │   └── value-objects/
│   │   │   │       ├── SocialNetworkLabel.test.ts -> Social network label tests
│   │   │   │       ├── SocialNetworkType.test.ts -> Social network type tests
│   │   │   │       ├── SocialNetworkUrl.test.ts -> Social network URL tests
│   │   │   │       ├── ThemeColor.test.ts -> Theme color value object tests
│   │   │   │       ├── WebsiteIcon.test.ts -> Website icon tests
│   │   │   │       └── WebsiteName.test.ts -> Website name tests
│   │   │   └── shared/
│   │   │       ├── services/
│   │   │       │   └── LogFormatterService.test.ts -> Log formatter service tests
│   │   │       └── value-objects/
│   │   │           └── LogLevel.test.ts -> Log level tests
│   │   ├── infrastructure/
│   │   │   ├── settings/
│   │   │   │   └── repositories/
│   │   │   │       └── MongooseWebsiteSettingsRepository.test.ts -> Mongoose repository tests
│   │   │   └── shared/
│   │   │       ├── adapters/
│   │   │       │   └── FileLoggerAdapter.test.ts -> File logger adapter tests
│   │   │       └── services/
│   │   │           └── FileStorageService.test.ts -> File storage service tests
│   │   ├── performance/
│   │   │   └── logging-performance.test.ts -> Logging performance tests
│   │   ├── presentation/
│   │   │   ├── admin/
│   │   │   │   └── hooks/
│   │   │   │       └── useSocialNetworksForm.test.tsx -> Social networks form hook tests
│   │   │   └── shared/
│   │   │       └── components/
│   │   │           ├── ImageManager/
│   │   │           │   └── ImageManager.test.tsx -> Image manager component tests
│   │   │           ├── DarkModeToggle.test.tsx -> Dark mode toggle tests
│   │   │           └── ThemeColorSelector.test.tsx -> Theme color selector component tests
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

**IMPORTANT**: Agents must NOT launch `docker compose up app` or `docker compose run --rm app npm run dev`. If these commands are needed, the agent must ask the user to run them manually.

- **Launch server**: `docker compose up app` (USER ONLY - agents must ask user to run this)
- **Install**: `docker compose run --rm app npm install`
- **Build**: `docker compose run --rm app npm run build` (Next.js with Turbopack)
- **Lint**: `docker compose run --rm app npm run lint` (ESLint with Next.js, TypeScript, Prettier)
- **Format**: `docker compose run --rm app npm run format` (Prettier)
- **Type Check**: `docker compose run --rm app npm run build:strict` (TypeScript strict mode)
- **e2etests**: `docker compose run --rm app npm run test:e2e` (Jest with ts-jest)
- **Test All**: `docker compose run --rm app npm run test` (Jest with ts-jest)
- **Single Test**: `docker compose run --rm app npm run test -- tests/file.test.ts` or `docker compose run --rm app npm run test -- --testNamePattern="pattern"`

## Code Style

You must follow clean code principles and best practices.
Furthermore, you must follow these specific rules:

- **Imports**: Use `import type` for type-only imports; group by external/internal with blank lines
- **Imports**: Use absolute imports from `src/` for internal modules
- **Formatting**: Prettier config (semicolons, single quotes, 4-space indent, 80 char width, ES5 trailing commas)
- **Types**: Strict TypeScript enabled; use explicit types for function parameters and return values
- **Naming**: PascalCase for components/React elements, camelCase for variables/functions, UPPER_SNAKE for constants. do not use abbreviations.
- **Error Handling**: Use try/catch for async operations; throw descriptive Error objects
- **Components**: Functional components with TypeScript interfaces; use React.FC sparingly
- **Styling**: Use Chakra UI for component styling and theming. Leverage Chakra's built-in responsive design system and accessibility features. Ensure responsive design with base/sm/md/lg/xl breakpoints for layouts.
- **File Structure**: Next.js App Router; components in dedicated directories when reused

## Github

**User**: dardael
**repo**: shower
```
