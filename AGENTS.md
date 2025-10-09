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
│   │   │   │       └── NotAuthorized.tsx  -> Not authorized component
│   │   ├── layout.tsx     -> Global layout for all pages
│   │   └── page.tsx       -> Route `/`
│   ├── domain/               # Domain Layer (entities, business rules)
│   │   ├── auth/
│   │   │   ├── entities/
│   │   │   │   └── User.ts            -> User entity
│   │   │   ├── repositories/
│   │   │   │   └── UserRepository.ts  -> User repository interface
│   │   │   ├── services/
│   │   │   │   └── AdminAccessPolicyService.ts -> Business rules for admin access
│   │   │   └── value-objects/
│   │   │       └── AdminAccessPolicy.ts -> Value object for admin access policy
│   ├── application/          # Application Layer (use-cases, services)
│   │   ├── auth/
│   │   │   ├── services/
│   │   │   │   └── OAuthService.ts    -> Service for OAuth integration
│   │   │   ├── AuthenticateUser.ts    -> Use case for authenticating a user
│   │   │   ├── AuthorizeAdminAccess.ts -> Use case for authorizing admin access
│   │   │   ├── IAuthenticateUser.ts   -> Interface for AuthenticateUser use case
│   │   │   └── IAuthorizeAdminAccess.ts -> Interface for AuthorizeAdminAccess use case
│   ├── infrastructure/       # Infrastructure Layer (adapters, database)
│   │   ├── auth/
│   │   │   ├── adapters/
│   │   │   │   └── GoogleOAuthAdapter.ts -> Adapter for Google OAuth
│   │   │   ├── api/
│   │   │   │   └── NextAuthHandler.ts -> NextAuth API handler
│   │   │   ├── repositories/
│   │   │   │   └── InMemoryUserRepository.ts -> In-memory implementation of UserRepository
│   │   ├── container.ts      -> Dependency injection container
│   ├── shared/               # Shared Layer (utilities, generic types)
│   │   ├── components/
│   │   │   ├── LoginButton.tsx        -> Login button component
│   │   │   └── LogoutButton.tsx       -> Logout button component
├── test/                     # Test Layer
│   ├── e2e/ # end to end tests
│   ├── unit/ # unit test following the same structure as src
    │   ├── application/
    │   │   ├── auth/
    │   │   │   ├── AuthenticateUser.test.ts
    │   │   │   ├── AuthorizeAdminAccess.test.ts
    │   ├── domain/
    │   │   ├── auth/
    │   │   │   ├── value-objects/
    │   │   │   │   ├── AdminAccessPolicy.test.ts
├── .dockerignore
├── .gitignore
├── .prettierignore
├── .prettierrc.js
├── AGENTS.md
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
├── tsconfig.json
```

## Commands

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
- **Styling**: Use Tailwind CSS for utility-first styling. Combine it with Headless UI for accessible, unstyled components. Ensure responsive design with sm/md/lg breakpoints for layouts.
- **File Structure**: Next.js App Router; components in dedicated directories when reused

## Github

**User**: dardael
**repo**: shower
