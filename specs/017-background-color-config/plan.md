# Implementation Plan: Background Color Configuration

**Branch**: `017-background-color-config` | **Date**: 2025-12-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/017-background-color-config/spec.md`

## Summary

Add a background color configuration option for the public website body. The feature allows administrators to select a background color from a predefined palette (same as theme color), positioned adjacent to the theme color selector in Website Settings. The background color applies only to the public site body and supports both light and dark theme modes.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: Chakra UI v3, React 19, tsyringe for DI, MongoDB via Mongoose  
**Storage**: MongoDB (WebsiteSetting entity) + localStorage for client-side caching  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web (Node.js server, modern browsers)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single admin user, public visitors

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                                        |
| ------------------------------------ | ------ | -------------------------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Follow existing DDD/Hexagonal pattern (Domain → Application → Infrastructure → Presentation) |
| II. Focused Testing Approach         | PASS   | No tests unless explicitly requested                                                         |
| III. Simplicity-First Implementation | PASS   | Reuse existing ThemeColorSelector pattern, no performance monitoring                         |
| IV. Security by Default              | PASS   | Settings API already protected by auth middleware                                            |
| V. Clean Architecture Compliance     | PASS   | Follow existing WebsiteSetting entity pattern                                                |
| VI. Accessibility-First Design       | PASS   | Use semantic color tokens (bg, fg), ensure contrast in both modes                            |
| VII. YAGNI                           | PASS   | Only implement background color for public body, no extras                                   |
| VIII. DRY                            | PASS   | Reuse existing color palette and selector component pattern                                  |
| IX. KISS                             | PASS   | Simple color selector, straightforward persistence                                           |

**Gate Result**: PASS - All constitution principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/017-background-color-config/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── api/
│       └── settings/
│           ├── route.ts                    # Extend GET/POST for backgroundColor
│           └── types.ts                    # Add backgroundColor to types
├── domain/
│   └── settings/
│       ├── constants/
│       │   ├── SettingKeys.ts             # Add BACKGROUND_COLOR key
│       │   └── BackgroundColorPalette.ts  # (optional) or reuse ThemeColorPalette
│       ├── entities/
│       │   └── WebsiteSetting.ts          # Add factory method for backgroundColor
│       └── value-objects/
│           └── BackgroundColor.ts         # New value object (similar to ThemeColor)
├── application/
│   └── settings/
│       ├── IGetBackgroundColor.ts         # Interface for get use case
│       ├── IUpdateBackgroundColor.ts      # Interface for update use case
│       ├── GetBackgroundColor.ts          # Get use case implementation
│       └── UpdateBackgroundColor.ts       # Update use case implementation
├── infrastructure/
│   └── container.ts                       # Register new services
└── presentation/
    ├── admin/
    │   └── components/
    │       ├── WebsiteSettingsForm.tsx    # Add BackgroundColorSelector
    │       └── BackgroundColorSelector.tsx # New component (or reuse pattern)
    └── shared/
        ├── contexts/
        │   └── BackgroundColorContext.tsx # Context for public site
        └── hooks/
            └── useBackgroundColor.ts      # Hook for fetching/caching

test/
└── unit/
    └── (tests only if explicitly requested)
```

**Structure Decision**: Follows existing web application structure with DDD layers. Reuses patterns from theme color implementation.

## Post-Design Constitution Re-Check

_Re-evaluated after Phase 1 design completion._

| Principle                            | Status | Validation                                                                 |
| ------------------------------------ | ------ | -------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Design follows Domain → Application → Infrastructure → Presentation layers |
| II. Focused Testing Approach         | PASS   | No tests specified in design; added only if requested                      |
| III. Simplicity-First Implementation | PASS   | No performance monitoring; reuses existing patterns                        |
| IV. Security by Default              | PASS   | API uses existing auth middleware (POST requires admin)                    |
| V. Clean Architecture Compliance     | PASS   | Value objects, use cases, repository pattern maintained                    |
| VI. Accessibility-First Design       | PASS   | Color scale variants ensure contrast (50 light, 900 dark)                  |
| VII. YAGNI                           | PASS   | Only background color for body; no extra features                          |
| VIII. DRY                            | PASS   | Reuses ThemeColorPalette, mirrors existing component patterns              |
| IX. KISS                             | PASS   | Simple storage/context/hook pattern proven in theme color                  |

**Post-Design Gate Result**: PASS - Design adheres to all constitution principles.

## Complexity Tracking

No violations - all gates pass. Implementation follows existing patterns.
