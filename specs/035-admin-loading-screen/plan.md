# Implementation Plan: Admin Loading Screen

**Branch**: `035-admin-loading-screen` | **Date**: 2025-12-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/035-admin-loading-screen/spec.md`

## Summary

Implement a full-screen loading screen for the admin panel that displays while essential settings (theme color, theme mode, font family, background color, logo, custom loader) are being fetched. The loading screen will use the custom loader animation if configured, falling back to a default spinner. This mirrors the existing public side loading pattern and reuses the `PublicPageLoader` component.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Chakra UI v3, existing PublicPageLoader component, existing settings context providers (ThemeColorContext, BackgroundColorContext, ThemeModeContext, FontProvider)  
**Storage**: N/A (uses existing settings infrastructure - localStorage caching + API sync)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web (modern browsers)  
**Project Type**: Web application (Next.js monorepo)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (reuse PublicPageLoader), KISS (simple code), configuration portability (no config changes needed)  
**Scale/Scope**: Single-user admin panel

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                        |
| ------------------------------------ | ------ | ---------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Uses existing layer structure (Presentation for components, hooks for state) |
| II. Focused Testing Approach         | PASS   | Tests only when requested, no over-mocking                                   |
| III. Simplicity-First Implementation | PASS   | No performance monitoring, reuses existing components                        |
| IV. Security by Default              | PASS   | Admin routes already protected by auth middleware                            |
| V. Clean Architecture Compliance     | PASS   | Follows existing provider pattern, proper separation                         |
| VI. Accessibility-First Design       | PASS   | Reuses accessible PublicPageLoader with ARIA attributes                      |
| VII. YAGNI                           | PASS   | Minimal implementation - one hook, one wrapper component                     |
| VIII. DRY                            | PASS   | Reuses PublicPageLoader and existing settings hooks                          |
| IX. KISS                             | PASS   | Simple orchestration of existing patterns                                    |
| X. Configuration Portability         | N/A    | No new config fields added                                                   |

## Project Structure

### Documentation (this feature)

```text
specs/035-admin-loading-screen/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── presentation/
│   ├── admin/
│   │   ├── components/
│   │   │   └── AdminLoadingScreen.tsx    # New: Wraps PublicPageLoader for admin
│   │   └── hooks/
│   │       └── useAdminLoadState.ts      # New: Orchestrates admin settings loading
│   └── shared/
│       ├── components/
│       │   └── PublicPageLoader.tsx      # Existing: Reused for admin
│       └── contexts/
│           └── AdminLoadStateContext.tsx # New: Provides load state to admin pages

test/
├── unit/
│   └── presentation/
│       └── admin/
│           ├── components/
│           │   └── AdminLoadingScreen.test.tsx
│           └── hooks/
│               └── useAdminLoadState.test.ts
└── integration/
    └── admin-loading-screen.integration.test.tsx
```

**Structure Decision**: Follows existing admin structure with new hook and component in `presentation/admin/`. Reuses shared components from `presentation/shared/`.

## Complexity Tracking

> No violations - all gates passed. Simple implementation reusing existing patterns.
