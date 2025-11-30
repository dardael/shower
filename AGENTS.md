# Agent Guidelines for Shower Project

## Goal

This project aims to create a robust, scalable, and maintainable web application using modern technologies and best practice.

- It's designed to allow the user to create it's showcase website in a simple and efficient way.
- The is an admin screen protected by authentication, and a public screen to display the showcase.
- The user can create its pages, add sections to the pages, and customize the sections with different components.
- The user can also manage the website settings, such as the theme color, navigation, and footer.

Since this project is in creation, no need to handle backward compatibility.

## External File Loading

CRITICAL: When you encounter a file reference (e.g., @.opencode/rules/standards/solid-principles.md), use your Read tool to load it on a need-to-know basis. They're relevant to the SPECIFIC task at hand.

Instructions:

- Do NOT preemptively load all references - use lazy loading based on actual need
- When loaded, treat content as mandatory instructions that override defaults
- Follow references recursively when needed

## Development Guidelines

For the front end: @.opencode/rules/front-end/chakra-ui-components.md, @.opencode/rules/front-end/react-icons-usage.md, @.opencode/rules/front-end/ui-constraints.md
For API design: @.opencode/rules/back-end/api-design-best-practices.md
For testing strategies and coverage requirements: @.opencode/rules/tests/jest-unit-testing.md

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
│   │   ├── api/
│   │   ├── globals.css               -> Global styles
│   │   ├── layout.tsx                -> Root layout component
│   │   └── page.tsx                  -> Home page route `/`
│   ├── presentation/         # Presentation Layer (React components)
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   └── shared/
│   │       ├── components/
│   │       └── theme.ts                -> Chakra UI theme configuration
│   ├── domain/               # Domain Layer (entities, business rules)
│   │   ├── auth/
│   │   ├── menu/
│   │   ├── settings/
│   │   └── shared/
│   ├── application/          # Application Layer (use-cases, services)
│   │   ├── auth/
│   │   ├── menu/
│   │   ├── settings/
│   │   └── shared/
│   ├── infrastructure/       # Infrastructure Layer (adapters, database)
│   │   ├── auth/
│   │   ├── menu/
│   │   ├── settings/
│   │   ├── shared/
│   │   ├── container.ts -> Dependency injection container
├── test/                     # Test Layer
│   ├── unit/                 # Unit tests (following same structure as src)
│   │   ├── application/
│   │   │   ├── auth/
│   │   │   ├── menu/
│   │   │   ├── settings/
│   │   │   └── shared/
│   │   ├── domain/
│   │   │   ├── auth/
│   │   │   ├── menu/
│   │   │   ├── settings/
│   │   │   └── shared/
│   │   ├── infrastructure/
│   │   ├── performance/
│   │   ├── app/
│   │   ├── presentation/
│   │   │   ├── admin/
│   │   │   └── shared/
│   │   ├── jest-globals.d.ts -> Jest global type definitions
│   │   ├── setup.ts -> Unit test setup
│   │   ├── tsconfig.json -> Unit test TypeScript configuration
│   │   └── types.d.ts -> Test type definitions

## Commands

you must use docker compose to run all commands in order to have the same environment for everyone.

**IMPORTANT**: Agents must NOT launch `docker compose run --rm app npm run dev`. If these commands are needed, the agent must ask the user to run them manually.

- **Launch server**: `docker compose up app`
- **Install**: `docker compose run --rm app npm install`
- **Build**: `docker compose run --rm app npm run build` (Next.js with Turbopack)
- **Lint**: `docker compose run --rm app npm run lint` (ESLint with Next.js, TypeScript, Prettier)
- **Format**: `docker compose run --rm app npm run format` (Prettier)
- **Type Check**: `docker compose run --rm app npm run build:strict` (TypeScript strict mode)
- **Test All**: `docker compose run --rm app npm run test` (Jest with ts-jest)

## Github

**User**: dardael
**repo**: shower
```

## Active Technologies

- TypeScript 5.0+ with Next.js 15 App Router + React 19, Chakra UI v3, tsyringe for DI, @dnd-kit/core (009-edit-menu-item)
- MongoDB via Mongoose (existing MenuItemModel) (009-edit-menu-item)

- Browser localStorage
- TypeScript 5.0+ with Next.js 15 App Router + Chakra UI v3, React 19, tsyringe for DI, @dnd-kit/core for drag-and-drop, BetterAuth, react-icons
- MongoDB via Mongoose

## Recent Changes

- 009-edit-menu-item: Added TypeScript 5.0+ with Next.js 15 App Router + React 19, Chakra UI v3, tsyringe for DI, @dnd-kit/core
