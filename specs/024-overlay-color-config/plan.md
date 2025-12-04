# Implementation Plan: Overlay Color Configuration

**Branch**: `024-overlay-color-config` | **Date**: 2025-12-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/024-overlay-color-config/spec.md`

## Summary

Add administrator-configurable overlay background color and opacity controls to image text overlays. Extends existing `ImageTextOverlay` entity with `overlayColor` (hex value) and `overlayOpacity` (0-100 percentage) attributes. Configuration displays in real-time in editor and renders on public pages.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router
**Primary Dependencies**: Tiptap (@tiptap/react, @tiptap/core), Chakra UI v3, React 19
**Storage**: Overlay attributes stored as HTML data attributes in page content (MongoDB via Mongoose)
**Testing**: Jest for unit tests and integration tests (explicitly requested)
**Target Platform**: Web application (responsive: 320px to 1920px)
**Project Type**: Web application (Next.js with DDD/Hexagonal architecture)
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)
**Scale/Scope**: Single-user admin interface, public showcase website

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle               | Status  | Notes                                                                                       |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------- |
| I. Architecture-First   | ✅ PASS | Follows existing patterns: Domain types → Tiptap extension → Presentation components        |
| II. Focused Testing     | ✅ PASS | Tests explicitly requested by user; following existing integration test patterns            |
| III. Simplicity-First   | ✅ PASS | No performance monitoring; extending existing implementation minimally                      |
| IV. Security by Default | ✅ PASS | Admin-only configuration; protected by existing authentication                              |
| V. Clean Architecture   | ✅ PASS | Extends domain types, presentation components only                                          |
| VI. Accessibility-First | ✅ PASS | Live preview ensures administrator can verify contrast; uses existing color picker patterns |
| VII. YAGNI              | ✅ PASS | Only implementing color and opacity - no gradients, presets, or advanced features           |
| VIII. DRY               | ✅ PASS | Reuses existing ColorPickerPopover component; extends existing overlay system               |
| IX. KISS                | ✅ PASS | Simple extension of existing overlay attributes with slider for opacity                     |

## Project Structure

### Documentation (this feature)

```text
specs/024-overlay-color-config/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no new API endpoints)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── pages/
│       └── types/
│           └── ImageOverlay.ts          # Extend with overlayColor, overlayOpacity defaults
├── presentation/
│   └── admin/
│       └── components/
│           └── PageContentEditor/
│               ├── extensions/
│               │   └── ImageWithOverlay.ts   # Add overlayBgColor, overlayBgOpacity attributes
│               └── OverlayToolbar.tsx        # Add color picker and opacity slider controls
│   └── shared/
│       └── components/
│           └── PublicPageContent/
│               └── public-page-content.css   # CSS for custom overlay backgrounds (if needed)

test/
├── integration/
│   └── overlay-color-config.integration.test.tsx  # New: overlay color/opacity on public page
└── unit/
    └── presentation/
        └── admin/
            └── components/
                └── PageContentEditor/
                    └── OverlayToolbar.test.tsx  # Extend with color/opacity tests (if exists)
```

**Structure Decision**: Web application following existing DDD/Hexagonal patterns. Feature extends existing infrastructure - no new layers or significant architectural changes.

## Complexity Tracking

> No violations requiring justification - this feature is a minimal extension of existing functionality.

## Post-Design Constitution Re-Check

_After Phase 1 design completion_

| Principle               | Status  | Post-Design Notes                                                                         |
| ----------------------- | ------- | ----------------------------------------------------------------------------------------- |
| I. Architecture-First   | ✅ PASS | Design maintains layer separation: Domain types extended, Presentation components updated |
| II. Focused Testing     | ✅ PASS | Integration tests designed for public page rendering as explicitly requested              |
| III. Simplicity-First   | ✅ PASS | No performance monitoring added; simple hex-to-rgba conversion                            |
| IV. Security by Default | ✅ PASS | No new security concerns; overlay config is content-only                                  |
| V. Clean Architecture   | ✅ PASS | No architectural changes; extends existing extension pattern                              |
| VI. Accessibility-First | ✅ PASS | Live preview in editor; admin controls readability                                        |
| VII. YAGNI              | ✅ PASS | Minimal implementation: 2 new attributes only                                             |
| VIII. DRY               | ✅ PASS | Reuses ColorPickerPopover; single source for overlay rendering                            |
| IX. KISS                | ✅ PASS | Simple slider for opacity; existing color picker pattern                                  |

## Phase 1 Artifacts

| Artifact      | Status      | Path                                                               |
| ------------- | ----------- | ------------------------------------------------------------------ |
| research.md   | ✅ Complete | `specs/024-overlay-color-config/research.md`                       |
| data-model.md | ✅ Complete | `specs/024-overlay-color-config/data-model.md`                     |
| contracts/    | ✅ Complete | `specs/024-overlay-color-config/contracts/README.md` (no new APIs) |
| quickstart.md | ✅ Complete | `specs/024-overlay-color-config/quickstart.md`                     |

## Next Steps

Run `/speckit.tasks` to generate the implementation task list.
