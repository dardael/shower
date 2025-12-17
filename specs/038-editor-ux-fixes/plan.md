# Implementation Plan: Editor UX Fixes

**Branch**: `038-editor-ux-fixes` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/038-editor-ux-fixes/spec.md`

## Summary

Fix three UX issues in the page content editor: (1) Make the toolbar sticky within the editor container so it remains visible when scrolling through long content, (2) Auto-scroll to the editor when clicking "edit page content", and (3) Fix button contrast issues where white text appears on white background.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19
**Primary Dependencies**: Chakra UI v3, Tiptap (@tiptap/react), react-icons
**Storage**: N/A (UI-only changes, no data persistence modifications)
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)
**Target Platform**: Web (desktop and mobile browsers)
**Project Type**: Web application (Next.js)
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)
**Scale/Scope**: Admin interface, single-user editing context

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                    | Status  | Notes                                                  |
| ---------------------------- | ------- | ------------------------------------------------------ |
| I. Architecture-First        | ✅ PASS | Changes confined to Presentation layer only            |
| II. Focused Testing          | ✅ PASS | No tests required unless explicitly requested          |
| III. Simplicity-First        | ✅ PASS | CSS-based solutions, no complex logic                  |
| IV. Security by Default      | ✅ N/A  | No security-related changes                            |
| V. Clean Architecture        | ✅ PASS | UI-only changes, no cross-layer dependencies           |
| VI. Accessibility-First      | ✅ PASS | Feature directly improves accessibility (contrast fix) |
| VII. YAGNI                   | ✅ PASS | Minimal implementation for stated requirements only    |
| VIII. DRY                    | ✅ PASS | Reusing existing Chakra UI patterns                    |
| IX. KISS                     | ✅ PASS | Simple CSS positioning and scroll behavior             |
| X. Configuration Portability | ✅ N/A  | No configuration changes                               |

## Project Structure

### Documentation (this feature)

```text
specs/038-editor-ux-fixes/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A - no data changes)
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # Spec validation checklist
```

### Source Code (repository root)

```text
src/
├── presentation/
│   └── admin/
│       └── components/
│           ├── MenuConfigForm.tsx                    # Add auto-scroll on edit
│           └── PageContentEditor/
│               ├── PageContentEditor.tsx             # Fix button contrast
│               └── TiptapEditor.tsx                  # Add sticky toolbar
```

**Structure Decision**: Changes are localized to existing Presentation layer components. No new files required.

## Complexity Tracking

No violations to justify - all changes align with constitution principles.
