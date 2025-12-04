# Implementation Plan: Image Text Overlay

**Branch**: `022-image-text-overlay` | **Date**: 2025-12-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/022-image-text-overlay/spec.md`

## Summary

Enable administrators to add styled text overlays on uploaded images in the page content editor. The overlay supports text content, color, font family (Google Fonts), font size (predefined sizes), vertical position, and horizontal alignment. Overlays are rendered on both the editor and public pages with responsive behavior.

**Technical Approach**: Extend the existing Tiptap ResizableImage with a wrapper node that stores overlay data as HTML data attributes. Reuse existing ColorPicker and FontPicker components. CSS handles overlay positioning and styling in both editor and public views.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: @tiptap/react, @tiptap/extension-image, Chakra UI v3, Google Fonts CSS API  
**Storage**: MongoDB via Mongoose (page content stored as HTML string)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested) - Integration test requested for public view rendering  
**Target Platform**: Web browser (desktop and mobile)  
**Project Type**: Web application (Next.js monorepo structure)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes (auto-calculated background), consistent theme color usage, YAGNI (minimal implementation), DRY (reuse ColorPicker, FontPicker), KISS (CSS-based overlay rendering)  
**Scale/Scope**: Single-tenant showcase website builder, admin-only editing

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status  | Notes                                                  |
| ------------------------------------ | ------- | ------------------------------------------------------ |
| I. Architecture-First Development    | ✅ PASS | Presentation layer only, no domain/application changes |
| II. Focused Testing Approach         | ✅ PASS | Integration test explicitly requested for public view  |
| III. Simplicity-First Implementation | ✅ PASS | CSS-based rendering, no performance monitoring         |
| IV. Security by Default              | ✅ PASS | Uses existing auth, DOMPurify sanitization             |
| V. Clean Architecture Compliance     | ✅ PASS | Extension pattern, component reuse                     |
| VI. Accessibility-First Design       | ✅ PASS | Auto-contrast background, theme-aware toolbar          |
| VII. YAGNI                           | ✅ PASS | Single overlay, predefined sizes, no drag-drop         |
| VIII. DRY                            | ✅ PASS | Reuses ColorPicker, FontPicker, font utilities         |
| IX. KISS                             | ✅ PASS | Data attributes, CSS positioning, no complex state     |

**Post-Design Re-check**: All gates passed. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/022-image-text-overlay/
├── plan.md              # This file
├── research.md          # Phase 0 output - technical decisions
├── data-model.md        # Phase 1 output - overlay data structure
├── quickstart.md        # Phase 1 output - implementation guide
├── contracts/           # Phase 1 output - TypeScript interfaces
│   └── api-contracts.md
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── pages/
│       └── types/
│           └── ImageOverlay.ts                  # NEW: Overlay type definitions
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── PageContentEditor/
│   │           ├── extensions/
│   │           │   └── ImageWithOverlay.ts      # NEW: Tiptap extension
│   │           ├── OverlayToolbar.tsx           # NEW: Overlay controls
│   │           ├── TiptapEditor.tsx             # MODIFY: Add extension
│   │           └── tiptap-styles.css            # MODIFY: Add overlay CSS
│   └── shared/
│       ├── components/
│       │   └── PublicPageContent/
│       │       ├── PublicPageContent.tsx        # MODIFY: Sanitization
│       │       └── public-page-content.css      # MODIFY: Overlay CSS
│       └── utils/
│           └── extractFontsFromHtml.ts          # MODIFY: Extract overlay fonts

test/
└── integration/
    └── image-text-overlay.integration.test.tsx  # NEW: Public view test
```

**Structure Decision**: Uses existing Next.js monorepo structure. Domain types for overlay configuration are placed in `src/domain/pages/types/` following DDD principles. Presentation layer handles UI components and styling. One integration test file added as explicitly requested.

## Complexity Tracking

> No violations requiring justification. All design decisions follow constitution principles.

## Related Documents

- [Research](./research.md) - Technical decisions and alternatives
- [Data Model](./data-model.md) - Overlay attribute structure
- [API Contracts](./contracts/api-contracts.md) - TypeScript interfaces
- [Quickstart](./quickstart.md) - Implementation order and key files
