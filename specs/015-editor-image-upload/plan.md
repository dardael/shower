# Implementation Plan: Editor Image Upload

**Branch**: `015-editor-image-upload` | **Date**: 2025-12-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/015-editor-image-upload/spec.md`

## Summary

Enable administrators to upload images from their computer directly into the page content rich text editor. Images are stored locally and served via API, displayed at cursor position in the editor, and rendered on the public side when visitors view page content. Leverages existing FileStorageService patterns and extends the Tiptap editor with file upload capabilities.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: @tiptap/react, @tiptap/extension-image, Chakra UI v3, React 19  
**Storage**: Local file system (public/page-content-images/), MongoDB for metadata if needed  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web application (modern browsers)  
**Project Type**: Web application with Next.js App Router  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single admin user, images up to 5MB, expected 10-50 images per page maximum

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status  | Notes                                                                                                                  |
| ------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| I. Architecture-First Development    | ✅ PASS | Follows DDD/Hexagonal: Domain for entities, Application for use cases, Infrastructure for storage, Presentation for UI |
| II. Focused Testing Approach         | ✅ PASS | Tests only when explicitly requested; will avoid over-mocking                                                          |
| III. Simplicity-First Implementation | ✅ PASS | No performance monitoring; simple file upload flow                                                                     |
| IV. Security by Default              | ✅ PASS | Admin authentication via existing BetterAuth; file type validation                                                     |
| V. Clean Architecture Compliance     | ✅ PASS | Proper separation of concerns; extends existing patterns                                                               |
| VI. Accessibility-First Design       | ✅ PASS | Upload UI follows existing contrast patterns; images responsive                                                        |
| VII. YAGNI                           | ✅ PASS | No image gallery, no optimization, no cleanup - minimum scope                                                          |
| VIII. DRY                            | ✅ PASS | Reuses FileStorageService, ImageManager patterns                                                                       |
| IX. KISS                             | ✅ PASS | Direct file upload, simple API, straightforward UI integration                                                         |

**Gate Status**: ✅ PASSED - No violations requiring justification

### Post-Design Re-check (Phase 1 Complete)

| Principle                            | Status  | Design Validation                                                                       |
| ------------------------------------ | ------- | --------------------------------------------------------------------------------------- |
| I. Architecture-First Development    | ✅ PASS | API routes in app/, storage in infrastructure/, UI in presentation/ - layers respected  |
| II. Focused Testing Approach         | ✅ PASS | No tests created; will add only when explicitly requested                               |
| III. Simplicity-First Implementation | ✅ PASS | No metrics, no logging overhead beyond existing patterns                                |
| IV. Security by Default              | ✅ PASS | Auth on upload, file validation, path traversal protection defined in contracts         |
| V. Clean Architecture Compliance     | ✅ PASS | Extends existing FileStorageService interface; dependency injection preserved           |
| VI. Accessibility-First Design       | ✅ PASS | Loading states use existing Chakra patterns; no new contrast issues introduced          |
| VII. YAGNI                           | ✅ PASS | No database metadata storage, no gallery, no cleanup - only what spec requires          |
| VIII. DRY                            | ✅ PASS | Reuses uploadImage pattern from FileStorageService, follows icon/logo endpoint patterns |
| IX. KISS                             | ✅ PASS | Single upload function, simple drag/paste handlers, no complex state management         |

**Post-Design Gate Status**: ✅ PASSED - Design artifacts comply with all constitution principles

## Project Structure

### Documentation (this feature)

```text
specs/015-editor-image-upload/
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
├── domain/
│   └── pages/
│       └── value-objects/
│           └── PageContentImageMetadata.ts    # New: image metadata value object
├── application/
│   └── pages/
│       └── use-cases/
│           └── UploadPageContentImage.ts      # New: upload use case
├── infrastructure/
│   └── shared/
│       └── services/
│           └── FileStorageService.ts          # Extend: add page content image methods
├── presentation/
│   └── admin/
│       └── components/
│           └── PageContentEditor/
│               └── TiptapEditor.tsx           # Extend: add file upload to image button
└── app/
    └── api/
        └── page-content-images/
            ├── route.ts                       # New: POST upload endpoint
            └── [filename]/
                └── route.ts                   # New: GET serve image endpoint

public/
└── page-content-images/                       # New: storage directory for uploads
```

**Structure Decision**: Extends existing Next.js App Router structure following DDD/Hexagonal patterns already established in the codebase.
