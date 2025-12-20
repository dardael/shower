# Implementation Plan: Products List Page Content

**Branch**: `042-products-list-page` | **Date**: 2025-12-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/042-products-list-page/spec.md`

## Summary

Enable administrators to embed dynamic product lists within page content using the Tiptap rich text editor. The implementation extends the existing editor with a ProductList custom node extension that stores category filter configuration via data attributes. A new public API endpoint fetches products for rendering on the public-facing pages.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: React 19, Tiptap (@tiptap/core, @tiptap/react), Chakra UI v3, tsyringe (DI), react-icons  
**Storage**: MongoDB via Mongoose (existing Product/Category entities), HTML string in PageContent entity  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web (Desktop and Mobile browsers)  
**Project Type**: Web application (Next.js monolith)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code), configuration portability (N/A - no new config fields)  
**Scale/Scope**: Standard web application, existing product catalog (100+ products supported)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                                                          |
| ------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Follows DDD/Hexagonal: Domain types, Application use cases, Infrastructure repository, Presentation components |
| II. Focused Testing Approach         | PASS   | No tests unless explicitly requested; will avoid over-mocking                                                  |
| III. Simplicity-First Implementation | PASS   | No performance monitoring; simple extension pattern                                                            |
| IV. Security by Default              | PASS   | Public API read-only; admin operations already protected                                                       |
| V. Clean Architecture Compliance     | PASS   | Proper layer separation maintained                                                                             |
| VI. Accessibility-First Design       | PASS   | Will use semantic color tokens for theme support                                                               |
| VII. YAGNI                           | PASS   | Minimal implementation: basic category filter, no pagination initially                                         |
| VIII. DRY                            | PASS   | Reuses existing Product entity, repository, and UI patterns                                                    |
| IX. KISS                             | PASS   | Simple data attribute storage, straightforward rendering                                                       |
| X. Configuration Portability         | N/A    | No new settings fields added                                                                                   |

**Gate Status**: PASS - All applicable principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/042-products-list-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── product/
│       └── types/
│           └── ProductListConfig.ts           # NEW: ProductList configuration types
├── application/
│   └── product/
│       └── use-cases/
│           └── GetPublicProducts.ts           # NEW: Public products fetch use case
├── infrastructure/
│   └── product/
│       └── services/
│           └── PublicProductServiceLocator.ts # NEW: DI for public product access
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── PageContentEditor/
│   │           ├── extensions/
│   │           │   ├── ProductList.ts         # NEW: Tiptap extension
│   │           │   └── index.ts               # UPDATE: Export new extension
│   │           ├── ProductListToolbar.tsx     # NEW: Configuration toolbar
│   │           └── TiptapEditor.tsx           # UPDATE: Add toolbar button
│   └── shared/
│       └── components/
│           └── PublicPageContent/
│               ├── ProductListRenderer.tsx    # NEW: Public rendering component
│               ├── PublicPageContent.tsx      # UPDATE: Render ProductList nodes
│               └── public-page-content.css    # UPDATE: ProductList styles
└── app/
    └── api/
        └── public/
            └── products/
                └── route.ts                   # NEW: Public products API endpoint

test/
└── unit/
    └── (tests only if explicitly requested)
```

**Structure Decision**: Follows existing Next.js + DDD architecture. New files integrate with established patterns for Tiptap extensions and public API endpoints.

## Complexity Tracking

> No violations requiring justification. Implementation follows established patterns.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | -          | -                                    |
