# Implementation Plan: Website Font Configuration

**Branch**: `014-website-font-config` | **Date**: 2025-12-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-website-font-config/spec.md`

## Summary

Enable administrators to configure a Google Font for the entire website (both public and admin interfaces). The font selector is positioned below the theme color setting, uses a curated list of popular Google Fonts, and provides real-time preview. Includes unit tests for font CRUD operations and integration tests for font rendering.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: Chakra UI v3, React 19, tsyringe (DI), Google Fonts CSS API  
**Storage**: MongoDB via Mongoose (existing WebsiteSettings collection)  
**Testing**: Jest for unit tests and integration tests (explicitly requested)  
**Target Platform**: Web (SSR + CSR)  
**Project Type**: Web application (Next.js monolith)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single admin user, showcase website

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle               | Status  | Notes                                                                        |
| ----------------------- | ------- | ---------------------------------------------------------------------------- |
| I. Architecture-First   | ✅ Pass | Follows DDD/Hexagonal - Domain → Application → Infrastructure → Presentation |
| II. Focused Testing     | ✅ Pass | Unit + integration tests explicitly requested                                |
| III. Simplicity-First   | ✅ Pass | No performance monitoring, simple font loading approach                      |
| IV. Security by Default | ✅ Pass | POST endpoint requires authentication                                        |
| V. Clean Architecture   | ✅ Pass | Proper layer separation, DI, SOLID principles                                |
| VI. Accessibility-First | ✅ Pass | Font fallbacks ensure readability                                            |
| VII. YAGNI              | ✅ Pass | Curated font list, minimal implementation                                    |
| VIII. DRY               | ✅ Pass | Reuses existing settings patterns                                            |
| IX. KISS                | ✅ Pass | Simple CSS variable approach for font application                            |

## Project Structure

### Documentation (this feature)

```text
specs/014-website-font-config/
├── plan.md              # This file
├── research.md          # Technical decisions (completed)
├── data-model.md        # Entity definitions (completed)
├── quickstart.md        # Implementation guide (completed)
├── contracts/           # API specifications (completed)
│   └── api.md
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── domain/settings/
│   ├── constants/
│   │   ├── SettingKeys.ts          # Add WEBSITE_FONT key
│   │   └── AvailableFonts.ts       # NEW: Font list and metadata
│   ├── value-objects/
│   │   └── WebsiteFont.ts          # NEW: Font value object
│   └── entities/
│       └── WebsiteSetting.ts       # Extend with font factory methods
├── application/settings/
│   ├── GetWebsiteFont.ts           # NEW: Use case
│   ├── IGetWebsiteFont.ts          # NEW: Interface
│   ├── UpdateWebsiteFont.ts        # NEW: Use case
│   ├── IUpdateWebsiteFont.ts       # NEW: Interface
│   ├── GetAvailableFonts.ts        # NEW: Use case
│   ├── IGetAvailableFonts.ts       # NEW: Interface
│   └── SettingsServiceLocator.ts   # Extend with font use cases
├── infrastructure/
│   ├── settings/repositories/
│   │   └── MongooseWebsiteSettingsRepository.ts  # Add font default
│   └── container.ts                # Register font use cases
├── app/api/settings/
│   ├── website-font/
│   │   ├── route.ts                # NEW: GET/POST endpoints
│   │   └── types.ts                # NEW: Request/Response types
│   └── available-fonts/
│       └── route.ts                # NEW: GET endpoint
└── presentation/
    ├── shared/
    │   ├── contexts/
    │   │   └── WebsiteFontContext.tsx    # NEW: Font context
    │   ├── hooks/
    │   │   └── useWebsiteFont.ts         # NEW: Font hook
    │   ├── components/
    │   │   └── FontProvider.tsx          # NEW: Font loader
    │   └── theme.ts                      # Update for font CSS variable
    └── admin/components/
        ├── FontSelector.tsx              # NEW: Font picker UI
        └── WebsiteSettingsForm.tsx       # Add FontSelector

test/
├── unit/
│   ├── domain/settings/value-objects/
│   │   └── WebsiteFont.test.ts           # NEW
│   └── application/settings/
│       ├── GetWebsiteFont.test.ts        # NEW
│       └── UpdateWebsiteFont.test.ts     # NEW
└── integration/
    └── website-font.integration.test.tsx # NEW
```

**Structure Decision**: Follows existing DDD/Hexagonal architecture. Font configuration integrates with the established settings module pattern (similar to theme-color implementation).

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |
