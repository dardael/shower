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

This project must follow SOLID principles, DDD architecture, Hexagonal architecture. here a tree structure example to follow :

```
src/
├── presentation/         # Couche de présentation
│   ├── app/              # Routes définies avec l'App Router
│   │   ├── cart/         # Domaine "Panier"
│   │   │   ├── page.tsx          -> Route `/cart`
│   │   │   ├── layout.tsx        -> Layout spécifique au panier (optionnel)
│   │   │   └── components/
│   │   │       └── CartItem.tsx  -> Composant pour un article dans le panier
│   │   ├── product/      # Domaine "Produit"
│   │   │   ├── page.tsx          -> Route `/product`
│   │   │   ├── [id]/             -> Routes dynamiques pour les produits
│   │   │   │   └── page.tsx      -> Route `/product/:id`
│   │   │   ├── layout.tsx        -> Layout spécifique au produit (optionnel)
│   │   │   └── components/
│   │   │       └── ProductCard.tsx -> Composant pour afficher un produit
│   │   ├── layout.tsx     -> Layout global pour toutes les pages
│   │   └── page.tsx       -> Route `/`
├── domain/               # Couche de domaine (entités, règles métier)
├── application/          # Couche application (use-cases, services)
├── infrastructure/       # Couche infrastructure (adapters, base de données)
  ├── cart/             # Adaptateurs pour le panier
  │   │   └── api/          # Routes API associées au panier
  │   │       └── route.ts  # Route API pour le panier
  │   ├── product/          # Adaptateurs pour les produits
  │   │   └── api/          # Routes API associées aux produits
  │   │       └── route.ts  # Route API pour les produits
│ └── database/         # Configuration de la base de données (ex. Prisma)
├── shared/               # Couche partagée (utilitaires, types génériques)
```

## Commands

- **Build**: `docker compose run --rm app npm run build` (Next.js with Turbopack)
- **Lint**: `docker compose run --rm npm run lint` (ESLint with Next.js, TypeScript, Prettier)
- **Format**: `docker compose run --rm npm run format` (Prettier)
- **Type Check**: `docker compose run --rm npm run build:strict` (TypeScript strict mode)
- **Test All**: `docker compose run --rm npm run test` (Jest with ts-jest)
- **Single Test**: `docker compose run --rm npm run test -- __tests__/file.test.ts` or `docker compose run --rm npm run test -- --testNamePattern="pattern"`

## Code Style

You must follow clean code principles and best practices.
Furthermore, you must follow these specific rules:

- **Imports**: Use `import type` for type-only imports; group by external/internal with blank lines
- **Imports**: Use absolute imports from `src/` for internal modules
- **Formatting**: Prettier config (semicolons, single quotes, 4-space indent, 80 char width, ES5 trailing commas)
- **Types**: Strict TypeScript enabled; use explicit types for function parameters and return values
- **Naming**: PascalCase for components/React elements, camelCase for variables/functions, UPPER_SNAKE for constants
- **Error Handling**: Use try/catch for async operations; throw descriptive Error objects
- **Components**: Functional components with TypeScript interfaces; use React.FC sparingly
- **Styling**: Tailwind CSS classes; responsive design with sm/md/lg breakpoints
- **File Structure**: Next.js App Router; components in dedicated directories when reused
