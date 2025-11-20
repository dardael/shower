# Implementation Plan: Dark Mode Toggle

**Branch**: `003-dark-mode-toggle` | **Date**: 2025-11-23 | **Spec**: [/specs/003-dark-mode-toggle/spec.md](/specs/003-dark-mode-toggle/spec.md)
**Input**: Feature specification from `/specs/003-dark-mode-toggle/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Implement a dark mode toggle button in the admin panel menu using Chakra UI v3's color mode system with Next.js 15. The system detects browser theme preference on first access, persists user choice in localStorage, and applies the theme only to the admin interface. Following DDD architecture with proper layer separation: Domain entities for theme concepts, Application services for theme management, Infrastructure adapters for browser storage, and Presentation components for the UI toggle. Includes comprehensive testing strategy and enhanced logging integration.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15  
**Primary Dependencies**: Chakra UI v3, React 18, Next.js API routes  
**Storage**: Browser localStorage for theme persistence  
**Testing**: Jest for unit tests, React Testing Library for component tests  
**Target Platform**: Web browser (admin interface only)  
**Project Type**: Web application with DDD architecture  
**Performance Goals**: Theme switching within 1 second, immediate visual feedback  
**Constraints**: Admin-only functionality, localStorage dependency, browser compatibility  
**Scale/Scope**: Single admin interface component with theme persistence

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Required Compliance Gates

- **Architecture-First Development**: Must follow DDD and Hexagonal Architecture with proper layer separation
- **Test-Driven Quality**: Must include comprehensive unit, integration, and e2e testing strategy
- **Production-Grade Observability**: Must implement enhanced logging system (no console methods)
- **Security by Default**: Must include authentication/authorization for admin features
- **Performance-Conscious Development**: Must address async operations, caching, and optimization

### Validation Criteria

- [x] Architecture follows Domain-Driven Design patterns
- [x] Layer dependencies flow inward only (Presentation → Application → Domain → Infrastructure)
- [x] Testing strategy covers unit, integration, and e2e scenarios
- [x] Enhanced logging system integration planned
- [x] Security controls implemented for protected features
- [x] Performance considerations addressed (async, caching, optimization)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── contracts/           # Phase 1 output (/speckit.plan command)
```

### Source Code (repository root)

```text
src/
├── app/                    # Next.js App Router (API routes and pages)
│   ├── admin/
│   │   ├── layout.tsx     # Admin layout with theme provider
│   │   └── page.tsx       # Admin dashboard
│   └── api/
├── presentation/           # Presentation Layer (React components)
│   ├── admin/
│   │   ├── components/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── DarkModeToggle.tsx  # NEW: Theme toggle component
│   │   └── hooks/
│   │       └── useTheme.ts  # NEW: Theme management hook
│   └── shared/
│       ├── components/
│       │   └── ui/
│       ├── contexts/
│       │   └── ThemeContext.tsx  # NEW: Theme context
│       └── hooks/
│           └── useLogger.ts
├── domain/               # Domain Layer (entities, business rules)
│   └── settings/
│       ├── entities/
│       │   └── ThemePreference.ts  # NEW: Theme preference entity
│       ├── value-objects/
│       │   └── ThemeMode.ts        # NEW: Theme mode value object
│       └── services/
│           └── IThemeStorageService.ts  # NEW: Storage interface
├── application/          # Application Layer (use-cases, services)
│   └── settings/
│       ├── GetThemePreference.ts    # NEW: Get theme use case
│       ├── UpdateThemePreference.ts # NEW: Update theme use case
│       └── services/
│           └── LocalStorageThemeService.ts  # NEW: LocalStorage implementation
└── infrastructure/       # Infrastructure Layer (adapters, database)
    └── settings/
        └── adapters/
            └── BrowserStorageAdapter.ts  # NEW: Browser storage adapter

test/                     # Test Layer
├── unit/
│   ├── presentation/
│   │   └── admin/
│   │       └── components/
│   │           └── DarkModeToggle.test.tsx  # NEW: Component tests
│   ├── domain/
│   │   └── settings/
│   │       └── entities/
│   │           └── ThemePreference.test.ts   # NEW: Entity tests
│   └── application/
│       └── settings/
│           └── LocalStorageThemeService.test.ts  # NEW: Service tests
└── integration/
    └── theme-persistence.integration.test.ts  # NEW: Integration tests
```

**Structure Decision**: Following the existing DDD architecture with proper layer separation. The dark mode toggle feature spans all layers: Domain entities for theme concepts, Application services for theme management logic, Infrastructure adapters for browser storage, and Presentation components for the UI toggle.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
