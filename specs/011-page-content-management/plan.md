# Implementation Plan: Page Content Management

**Branch**: `011-page-content-management` | **Date**: 2025-12-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-page-content-management/spec.md`

## Summary

Allow administrators to configure rich text page content for menu items using a Tiptap-based editor. The content supports text formatting, images (via URL), and integrates with Chakra UI theming. Public users see the configured content when visiting menu item URLs.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: React 19, Chakra UI v3, Tiptap (editor), tsyringe (DI), Mongoose  
**Storage**: MongoDB via Mongoose  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web application (browser)  
**Project Type**: Web application (Next.js full-stack)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single-tenant showcase website builder

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                      |
| ------------------------------------ | ------ | -------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | DDD + Hexagonal architecture followed                                      |
| II. Focused Testing Approach         | PASS   | Unit tests for CRUD, integration tests for public display per user request |
| III. Simplicity-First Implementation | PASS   | No performance monitoring                                                  |
| IV. Security by Default              | PASS   | Admin endpoints require authentication                                     |
| V. Clean Architecture Compliance     | PASS   | Proper layer separation maintained                                         |
| VI. Accessibility-First Design       | PASS   | Theme colors for headings, dark/light mode support                         |
| VII. YAGNI                           | PASS   | Only implementing requested features                                       |
| VIII. DRY                            | PASS   | Reusing existing patterns from menu/settings                               |
| IX. KISS                             | PASS   | Simple CRUD operations, established patterns                               |

## Project Structure

### Documentation (this feature)

```text
specs/011-page-content-management/
├── plan.md              # This file
├── research.md          # Rich text editor research
├── data-model.md        # PageContent entity design
├── quickstart.md        # Quick start guide
├── contracts/           # API contracts
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   ├── settings/pages/
│   │   │   ├── route.ts                    # POST (create)
│   │   │   └── [menuItemId]/
│   │   │       └── route.ts                # GET, PATCH, DELETE
│   │   └── pages/
│   │       └── [menuItemId]/
│   │           └── route.ts                # GET (public)
│   └── [slug]/
│       └── page.tsx                        # Dynamic public page route
├── domain/
│   └── pages/
│       ├── entities/
│       │   └── PageContent.ts
│       ├── value-objects/
│       │   └── PageContentBody.ts
│       └── repositories/
│           └── IPageContentRepository.ts
├── application/
│   └── pages/
│       ├── use-cases/
│       │   ├── CreatePageContent.ts
│       │   ├── UpdatePageContent.ts
│       │   ├── DeletePageContent.ts
│       │   └── GetPageContent.ts
│       └── interfaces/
│           ├── ICreatePageContent.ts
│           ├── IUpdatePageContent.ts
│           ├── IDeletePageContent.ts
│           └── IGetPageContent.ts
├── infrastructure/
│   └── pages/
│       ├── repositories/
│       │   └── PageContentRepository.ts
│       └── models/
│           └── PageContentModel.ts
└── presentation/
    ├── admin/
    │   └── components/
    │       └── PageContentEditor/
    │           ├── PageContentEditor.tsx
    │           └── TiptapEditor.tsx
    └── shared/
        └── components/
            └── PublicPageContent/
                └── PublicPageContent.tsx

test/
├── unit/
│   ├── domain/
│   │   └── pages/
│   │       ├── PageContent.test.ts
│   │       └── PageContentBody.test.ts
│   └── application/
│       └── pages/
│           ├── CreatePageContent.test.ts
│           ├── UpdatePageContent.test.ts
│           ├── DeletePageContent.test.ts
│           └── GetPageContent.test.ts
└── integration/
    └── page-content.integration.test.tsx
```

**Structure Decision**: Following established DDD + Hexagonal pattern already in use for menu and settings modules. Adding new `pages` module following same conventions.

## Complexity Tracking

No violations to justify. Implementation follows established patterns without adding complexity.

## Dependencies

### New NPM Packages

```json
{
  "@tiptap/react": "^2.x",
  "@tiptap/pm": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-image": "^2.x",
  "@tiptap/extension-link": "^2.x"
}
```

### Existing Dependencies Used

- Chakra UI v3 (theming, components)
- tsyringe (dependency injection)
- Mongoose (MongoDB ODM)
- Jest (testing)

## Related Documents

- [research.md](./research.md) - Rich text editor evaluation
- [data-model.md](./data-model.md) - Entity and database design
- [contracts/api-contracts.md](./contracts/api-contracts.md) - API specifications
- [quickstart.md](./quickstart.md) - Developer quick start guide
