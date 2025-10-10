# Agent Guidelines for Shower Project

## Goal

This project aims to create a robust, scalable, and maintainable web application using modern technologies and best practice.

- It's designed to allow the user to create it's showcase website in a simple and efficient way.
- The is an admin screen protected by authentication, and a public screen to display the showcase.
- The user can create it's pages, add sections to the pages, and customize the sections with different components.
- The user can also manage the website settings, such as the theme, the navigation, and the footer.

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
│   ├── presentation/         # Presentation Layer
│   │   ├── app/              # Routes defined using App Router
│   │   │   ├── admin/        # Admin domain
│   │   │   │   ├── page.tsx          -> Route `/admin`
│   │   │   │   └── components/
│   │   │   │       ├── AdminDashboard.tsx -> Admin dashboard component
│   │   │   │       ├── NotAuthorized.tsx  -> Not authorized component
│   │   │   │       └── WebsiteSettingsForm.tsx -> Website settings form
│   │   ├── layout.tsx     -> Global layout for all pages
│   │   ├── page.tsx       -> Route `/`
│   │   └── shared/         # Shared presentation components
│   │       └── components/
│   │           ├── theme/  # Theme-related components
│   │           │   ├── theme-provider.tsx -> Theme provider wrapper
│   │           │   └── theme-toggle.tsx -> Theme toggle button
│   │           ├── ui/     # shadcn/ui components
│   │           │   ├── alert.tsx -> Alert component
│   │           │   ├── button.tsx -> Button component
│   │           │   ├── card.tsx -> Card component
│   │           │   ├── dropdown-menu.tsx -> Dropdown menu component
│   │           │   ├── form.tsx -> Form components
│   │           │   ├── input.tsx -> Input component
│   │           │   ├── label.tsx -> Label component
│   │           │   └── sonner.tsx -> Toast notifications
│   │           ├── LoginButton.tsx -> Login button component
│   │           └── LogoutButton.tsx -> Logout button component
│   ├── domain/               # Domain Layer (entities, business rules)
│   │   ├── auth/
│   │   │   ├── entities/
│   │   │   │   └── User.ts            -> User entity
│   │   │   ├── services/
│   │   │   │   └── AdminAccessPolicyService.ts -> Business rules for admin access
│   │   │   └── value-objects/
│   │   │       └── AdminAccessPolicy.ts -> Value object for admin access policy
│   │   ├── settings/
│   │   │   ├── entities/
│   │   │   │   └── WebsiteSettings.ts -> Website settings entity
│   │   │   ├── repositories/
│   │   │   │   └── WebsiteSettingsRepository.ts -> Repository interface
│   │   │   └── value-objects/
│   │   │       └── WebsiteName.ts -> Website name value object
│   │   └── shared/
│   │       ├── services/
│   │       │   └── LogFormatterService.ts -> Log formatting service
│   │       └── value-objects/
│   │           └── LogLevel.ts -> Log level value object
│   ├── application/          # Application Layer (use-cases, services)
│   │   ├── auth/
│   │   │   ├── services/
│   │   │   │   └── IBetterAuthClientService.ts -> Better auth client service interface
│   │   │   ├── AuthorizeAdminAccess.ts -> Use case for authorizing admin access
│   │   │   └── IAuthorizeAdminAccess.ts -> Interface for AuthorizeAdminAccess use case
│   │   ├── settings/
│   │   │   ├── GetWebsiteName.ts -> Use case for getting website name
│   │   │   ├── IGetWebsiteName.ts -> Interface for GetWebsiteName use case
│   │   │   ├── UpdateWebsiteName.ts -> Use case for updating website name
│   │   │   └── IUpdateWebsiteName.ts -> Interface for UpdateWebsiteName use case
│   │   └── shared/
│   │       ├── ILogger.ts -> Logger interface
│   │       └── LogMessage.ts -> Log message entity
│   ├── infrastructure/       # Infrastructure Layer (adapters, database)
│   │   ├── auth/
│   │   │   ├── adapters/
│   │   │   │   └── BetterAuthClientAdapter.ts -> Better auth client adapter
│   │   │   └── BetterAuthInstance.ts -> Better auth instance
│   │   ├── settings/
│   │   │   ├── models/
│   │   │   │   └── WebsiteSettingsModel.ts -> Mongoose model
│   │   │   └── repositories/
│   │   │       └── MongooseWebsiteSettingsRepository.ts -> MongoDB repository
│   │   ├── shared/
│   │   │   ├── adapters/
│   │   │   │   └── FileLoggerAdapter.ts -> File logger adapter
│   │   │   ├── databaseConnection.ts -> Database connection
│   │   │   └── databaseInitialization.ts -> Database initialization
│   │   └── container.ts      -> Dependency injection container
│   └── lib/                  # Utilities
│       └── utils.ts          -> Utility functions (cn helper for shadcn/ui)
├── test/                     # Test Layer
│   ├── e2e/                  # End to end tests
│   │   ├── admin/
│   │   │   └── admin-page.spec.ts
│   │   ├── fixtures/
│   │   │   ├── authHelpers.ts
│   │   │   └── test-database.ts
│   │   └── global-setup.ts
│   └── unit/                 # Unit tests following the same structure as src
│       ├── application/
│       │   ├── auth/
│       │   │   └── AuthorizeAdminAccess.test.ts
│       │   ├── settings/
│       │   │   ├── GetWebsiteName.test.ts
│       │   │   └── UpdateWebsiteName.test.ts
│       │   └── shared/
│       │       └── LogMessage.test.ts
│       ├── domain/
│       │   ├── auth/
│       │   │   └── value-objects/
│       │   │       └── AdminAccessPolicy.test.ts
│       │   ├── settings/
│       │   │   ├── entities/
│       │   │   │   └── WebsiteSettings.test.ts
│       │   │   └── value-objects/
│       │   │       └── WebsiteName.test.ts
│       │   └── shared/
│       │       ├── services/
│       │       │   └── LogFormatterService.test.ts
│       │       └── value-objects/
│       │           └── LogLevel.test.ts
│       └── infrastructure/
│           ├── settings/
│           │   └── repositories/
│           │       └── MongooseWebsiteSettingsRepository.test.ts
│           └── shared/
│               └── adapters/
│                   └── FileLoggerAdapter.test.ts
├── .dockerignore
├── .gitignore
├── .prettierignore
├── .prettierrc.js
├── AGENTS.md
├── components.json          # shadcn/ui configuration
├── Dockerfile
├── README.md
├── docker-compose.yml
├── eslint.config.mjs
├── jest.config.js
├── middleware.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Commands

you must use docker compose to run all commands in order to have the same environment for everyone.

- **Install**: `docker compose run --rm app npm install`
- **Build**: `docker compose run --rm app npm run build` (Next.js with Turbopack)
- **Lint**: `docker compose run --rm app npm run lint` (ESLint with Next.js, TypeScript, Prettier)
- **Format**: `docker compose run --rm app npm run format` (Prettier)
- **Type Check**: `docker compose run --rm app npm run build:strict` (TypeScript strict mode)
- **e2etests**: `docker compose run --rm app npm run test:e2e` (Jest with ts-jest)
- **Test All**: `docker compose run --rm app npm run test` (Jest with ts-jest)
- **Single Test**: `docker compose run --rm app npm run test -- tests/file.test.ts` or `docker compose run --rm app npm run test -- --testNamePattern="pattern"`

## UI Components

This project uses **shadcn/ui** as the default UI component library. All UI components must follow these guidelines:

### **Component Library**

- **Primary**: Use shadcn/ui components for all UI elements
- **Location**: All shadcn/ui components are located in `src/presentation/shared/components/ui/`
- **Installation**: Use `npx shadcn@latest add <component-name>` to add new components
- **Configuration**: shadcn/ui is configured in `components.json`

### **Available Components**

- **Button**: `@/presentation/shared/components/ui/button`
- **Input**: `@/presentation/shared/components/ui/input`
- **Card**: `@/presentation/shared/components/ui/card`
- **Form**: `@/presentation/shared/components/ui/form`
- **Label**: `@/presentation/shared/components/ui/label`
- **Alert**: `@/presentation/shared/components/ui/alert`
- **Dropdown Menu**: `@/presentation/shared/components/ui/dropdown-menu`
- **Sonner**: `@/presentation/shared/components/ui/sonner` (Toast notifications)

### **Theme Support**

- **Theme Provider**: `@/presentation/shared/components/theme/theme-provider`
- **Theme Toggle**: `@/presentation/shared/components/theme/theme-toggle`
- **Dark/Light Mode**: Fully supported with system preference detection
- **CSS Variables**: Configured in `src/app/globals.css`

### **Usage Guidelines**

- Always import from the presentation layer: `@/presentation/shared/components/ui/<component>`
- Use shadcn/ui components instead of custom HTML elements
- Leverage built-in variants and styling options
- Follow accessibility best practices (all components are accessible by default)
- Use semantic HTML structure with proper ARIA labels

### **Adding New Components**

1. Install: `docker compose run --rm app npx shadcn@latest add <component-name>`
2. Import: `import { Component } from '@/presentation/shared/components/ui/component';`
3. Use in your components following shadcn/ui patterns

## Code Style

You must follow clean code principles and best practices.
Furthermore, you must follow these specific rules:

- **Imports**: Use `import type` for type-only imports; group by external/internal with blank lines
- **Imports**: Use absolute imports from `src/` for internal modules
- **UI Components**: Always import shadcn/ui components from `@/presentation/shared/components/ui/`
- **Formatting**: Prettier config (semicolons, single quotes, 4-space indent, 80 char width, ES5 trailing commas)
- **Types**: Strict TypeScript enabled; use explicit types for function parameters and return values
- **Naming**: PascalCase for components/React elements, camelCase for variables/functions, UPPER_SNAKE for constants. do not use abbreviations.
- **Error Handling**: Use try/catch for async operations; throw descriptive Error objects
- **Components**: Functional components with TypeScript interfaces; use React.FC sparingly
- **Styling**: Use Tailwind CSS for utility-first styling combined with shadcn/ui components. Ensure responsive design with sm/md/lg breakpoints for layouts.
- **File Structure**: Next.js App Router; components in dedicated directories when reused
- **Architecture**: All UI components must be in the presentation layer following DDD principles

## Github

**User**: dardael
**repo**: shower
