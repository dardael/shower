# Implementation Plan: Image Full Bleed Layout

**Branch**: `029-image-full-bleed` | **Date**: 2025-12-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/029-image-full-bleed/spec.md`

## Summary

Enable administrators to configure images (with or without text overlay) to break out of the page content container and span the full viewport width (edge-to-edge), hiding background color on the sides. This is implemented by extending existing Tiptap image nodes with a `fullBleed` boolean attribute and adding CSS to break out of the container using negative margins.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Tiptap (@tiptap/react, @tiptap/core, @tiptap/extension-image), Chakra UI v3, react-icons  
**Storage**: N/A (uses existing HTML string storage in MongoDB via PageContent entity)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web (modern browsers)  
**Project Type**: Web application (Next.js full-stack)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single-tenant showcase website builder

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Gate                      | Status  | Notes                                         |
| ------------------------- | ------- | --------------------------------------------- |
| No new database entities  | ✅ PASS | Uses existing HTML string storage             |
| No new API endpoints      | ✅ PASS | Client-side only changes                      |
| Follows existing patterns | ✅ PASS | Mirrors fullWidth implementation              |
| SOLID principles          | ✅ PASS | Extends existing nodes, single responsibility |
| DRY principle             | ✅ PASS | Reuses existing toggle pattern                |
| KISS principle            | ✅ PASS | Simple attribute + CSS solution               |
| YAGNI principle           | ✅ PASS | Minimal implementation for requirement        |

## Project Structure

### Documentation (this feature)

```text
specs/029-image-full-bleed/
├── plan.md              # This file
├── research.md          # Phase 0 output - technical research
├── data-model.md        # Phase 1 output - entity changes
├── quickstart.md        # Phase 1 output - implementation guide
├── contracts/           # Phase 1 output - API/command contracts
│   └── editor-commands.md
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
src/
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── PageContentEditor/
│   │           ├── TiptapEditor.tsx          # Add fullBleed toggle + helper functions
│   │           ├── extensions/
│   │           │   └── ImageWithOverlay.ts   # Add fullBleed attribute
│   │           └── tiptap-styles.css         # Add editor indication styles
│   └── shared/
│       └── components/
│           └── PublicPageContent/
│               └── public-page-content.css   # Add full-bleed breakout styles

test/
├── unit/
│   └── presentation/
│       └── admin/
│           └── PageContentEditor/
│               └── fullBleed.test.ts         # Unit tests for toggle functions
└── integration/
    └── image-full-bleed.integration.test.tsx # Integration tests
```

**Structure Decision**: Extends existing presentation layer components. No new directories needed - all changes are additions to existing files.

## Complexity Tracking

No constitution violations. Implementation follows existing patterns with minimal additions.
