# Agent Guidelines for Shower Project

## Goal

This project aims to create a robust, scalable, and maintainable web application using modern technologies and best practice.

- It's designed to allow the user to create it's showcase website in a simple and efficient way.
- The is an admin screen protected by authentication, and a public screen to display the showcase.
- The user can create its pages, modify them and delete them.
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
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3, tsyringe (DI), existing FileStorageService, existing settings infrastructure (034-custom-loader)
- MongoDB via Mongoose (settings), local filesystem (`public/loaders/`) (034-custom-loader)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3, existing PublicPageLoader component, existing settings context providers (ThemeColorContext, BackgroundColorContext, ThemeModeContext, FontProvider) (035-admin-loading-screen)
- N/A (uses existing settings infrastructure - localStorage caching + API sync) (035-admin-loading-screen)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Tiptap (@tiptap/extension-table, @tiptap/extension-table-cell), Chakra UI v3, DOMPurify (037-sheet-cell-format)
- HTML string in MongoDB via PageContent entity (existing infrastructure) (037-sheet-cell-format)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3, Tiptap (@tiptap/react), react-icons (038-editor-ux-fixes)
- N/A (UI-only changes, no data persistence modifications) (038-editor-ux-fixes)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Tiptap (@tiptap/extension-table, @tiptap/extension-table-cell), Chakra UI v3, existing TableToolbar component (039-sheet-column-width)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3, tsyringe (DI), Mongoose, node-cron (for scheduling) (001-scheduled-restart-config)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3, tsyringe (DI), Mongoose, @dnd-kit/core (drag-and-drop), react-icons (041-product-category-management)
- MongoDB via Mongoose, local filesystem (`public/page-content-images/`) for product images (041-product-category-management)
- TypeScript 5.0+ with Next.js 15 App Router + React 19, Tiptap (@tiptap/core, @tiptap/react), Chakra UI v3, tsyringe (DI), react-icons (042-products-list-page)
- MongoDB via Mongoose (existing Product/Category entities), HTML string in PageContent entity (042-products-list-page)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3, react-icons, existing SellingConfigContext, existing Product entity (044-shopping-cart)
- Browser localStorage (key: `shower-cart`) with BroadcastChannel for cross-tab sync (044-shopping-cart)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3, tsyringe (DI), Mongoose, existing CartContext, existing BetterAuth authentication (045-order-management)
- MongoDB via Mongoose (Order entity), localStorage (`shower-cart`) for cart (045-order-management)

- TypeScript 5.0+ with Next.js 15 App Router + React 19, Chakra UI v3, existing data fetching hooks/utilities (025-public-loading-page)
- N/A (data fetched from existing APIs) (025-public-loading-page)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3, next-themes (via useColorMode hook) (026-admin-bgcolor-preview)
- N/A (uses existing settings infrastructure) (026-admin-bgcolor-preview)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3, next-themes (via useColorMode hook), tsyringe for DI (027-theme-mode-config)
- MongoDB via Mongoose (existing settings infrastructure) (027-theme-mode-config)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3, existing PublicPageLayout component (028-sticky-footer-layout)
- N/A (CSS-only change, no data persistence) (028-sticky-footer-layout)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Tiptap (@tiptap/react, @tiptap/core, @tiptap/extension-image), Chakra UI v3, react-icons (029-image-full-bleed)
- N/A (uses existing HTML string storage in MongoDB via PageContent entity) (029-image-full-bleed)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3, Tiptap (@tiptap/react, @tiptap/extension-color), tsyringe for DI (030-custom-color-palette)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3 (Box, VStack, HStack, IconButton), react-icons (FiMenu, FiX), existing FocusTrap utility (031-mobile-header-menu)
- N/A (uses existing menu data from usePublicHeaderMenu hook) (031-mobile-header-menu)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3, react-icons, existing SocialNetworksFooter component (032-mobile-footer)
- N/A (uses existing social networks data from settings API) (032-mobile-footer)
- TypeScript 5.0+ with Next.js 15 App Router + React 19 + Chakra UI v3, tsyringe (DI), archiver/adm-zip (ZIP handling), Mongoose (033-config-export-import)
- MongoDB via Mongoose, local filesystem (`public/page-content-images/`) (033-config-export-import)

- Local file system (public/page-content-images/)
- Browser localStorage
- TypeScript 5.0+ with Next.js 15 App Router + Chakra UI v3, React 19, tsyringe for DI, @dnd-kit/core for drag-and-drop, BetterAuth, react-icons, Google Fonts CSS API
- MongoDB via Mongoose
- Tiptap (@tiptap/react, @tiptap/starter-kit, @tiptap/extension-image, @tiptap/extension-link, @tiptap/extension-color, @tiptap/extension-text-style, @tiptap/core) for rich text editing

## Recent Changes

- 025-public-loading-page: Added TypeScript 5.0+ with Next.js 15 App Router + React 19, Chakra UI v3, existing data fetching hooks/utilities
