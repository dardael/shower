# Tasks: Editor Image Upload

**Input**: Design documents from `/specs/015-editor-image-upload/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in specification. Tests will be omitted per focused testing approach.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Create storage directory and prepare infrastructure for image uploads

- [x] T001 Create storage directory at public/page-content-images/
- [x] T002 [P] Add .gitkeep to public/page-content-images/ to track empty directory

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Add PAGE_CONTENT_IMAGE_CONFIG constant in src/infrastructure/shared/services/FileStorageService.ts
- [x] T004 Update IFileStorageService interface with uploadPageContentImage() and deletePageContentImage() methods in src/infrastructure/shared/services/FileStorageService.ts
- [x] T005 Implement uploadPageContentImage() method in LocalFileStorageService class in src/infrastructure/shared/services/FileStorageService.ts
- [x] T006 Implement deletePageContentImage() method in LocalFileStorageService class in src/infrastructure/shared/services/FileStorageService.ts
- [x] T007 Register updated FileStorageService in src/infrastructure/container.ts (verify existing registration handles new methods)

**Checkpoint**: Foundation ready - FileStorageService can upload/delete page content images

---

## Phase 3: User Story 1 - Administrator Uploads Image in Rich Text Editor (Priority: P1) 🎯 MVP

**Goal**: Enable administrators to upload images via toolbar button, with images inserted at cursor position

**Independent Test**: Open page content editor, click image upload button, select image file, verify it appears in editor

### API Layer for User Story 1

- [x] T008 [US1] Create POST endpoint for image upload in src/app/api/page-content-images/route.ts
- [x] T009 [US1] Implement file validation (type, size) in POST handler in src/app/api/page-content-images/route.ts
- [x] T010 [US1] Add withApi wrapper with requireAuth: true in src/app/api/page-content-images/route.ts
- [x] T011 [US1] Return proper JSON response with image URL and metadata in src/app/api/page-content-images/route.ts

### Presentation Layer for User Story 1

- [x] T012 [US1] Add hidden file input element for image selection in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T013 [US1] Add isUploading state for loading indicator in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T014 [US1] Implement uploadImage async function to call API and insert image in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T015 [US1] Replace URL input with file upload trigger on image button click in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T016 [US1] Add loading spinner overlay during upload in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T017 [US1] Add editorProps.handleDrop for drag-and-drop image upload in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T018 [US1] Add editorProps.handlePaste for clipboard image paste in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx

### Quality Checks for User Story 1

- [x] T019 [US1] Verify contrast compliance for loading spinner in light and dark modes
- [x] T020 [US1] Verify YAGNI compliance - only toolbar upload, drag-drop, paste implemented
- [x] T021 [US1] Verify DRY compliance - uploadImage function reused for all upload methods
- [x] T022 [US1] Verify KISS compliance - simple state management, no complex upload queuing

**Checkpoint**: Administrator can upload images via button, drag-drop, or paste; images appear in editor

---

## Phase 4: User Story 2 - Public User Views Uploaded Images (Priority: P1)

**Goal**: Serve uploaded images publicly so visitors can view them on page content

**Independent Test**: Navigate to a page that contains uploaded images, verify all images display correctly

### API Layer for User Story 2

- [x] T023 [P] [US2] Create GET endpoint for serving images in src/app/api/page-content-images/[filename]/route.ts
- [x] T024 [US2] Implement filename sanitization using existing sanitizeFilename utility in src/app/api/page-content-images/[filename]/route.ts
- [x] T025 [US2] Add path traversal protection (validate file is within page-content-images directory) in src/app/api/page-content-images/[filename]/route.ts
- [x] T026 [US2] Set appropriate Content-Type header based on file extension in src/app/api/page-content-images/[filename]/route.ts
- [x] T027 [US2] Set Cache-Control header (public, max-age=31536000, immutable) in src/app/api/page-content-images/[filename]/route.ts
- [x] T028 [US2] Return 404 for non-existent files in src/app/api/page-content-images/[filename]/route.ts

### Styling for User Story 2

- [x] T029 [P] [US2] Verify .tiptap-image CSS class provides responsive sizing in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [x] T030 [P] [US2] Verify public page content renders images correctly with existing PublicPageContent component in src/presentation/shared/components/PublicPageContent/

### Quality Checks for User Story 2

- [x] T031 [US2] Verify images scale appropriately on viewports from 320px to 1920px
- [x] T032 [US2] Verify YAGNI compliance - no image optimization or CDN, simple file serving
- [x] T033 [US2] Verify KISS compliance - follows existing /api/icons/[filename] pattern

**Checkpoint**: Uploaded images are accessible via URL and display correctly on public pages

---

## Phase 5: User Story 3 - Administrator Handles Upload Errors (Priority: P2)

**Goal**: Provide clear feedback when image upload fails due to validation or network errors

**Independent Test**: Attempt to upload invalid files (wrong type, too large), verify error messages are displayed

### Error Handling for User Story 3

- [x] T034 [US3] Add client-side file type validation before upload in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T035 [US3] Add client-side file size validation (5MB limit) before upload in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T036 [US3] Display toast notification for file type validation errors in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T037 [US3] Display toast notification for file size validation errors in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T038 [US3] Handle network/server errors in uploadImage function with toast notification in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T039 [US3] Ensure isUploading state resets on error to allow retry in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx

### Quality Checks for User Story 3

- [x] T040 [US3] Verify error toast messages are clear and actionable
- [x] T041 [US3] Verify YAGNI compliance - simple error messages, no retry UI or advanced error tracking
- [x] T042 [US3] Verify KISS compliance - straightforward try/catch error handling

**Checkpoint**: All validation and network errors display clear, actionable feedback

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T043 [P] Remove showImageInput state and imageUrl state (replaced by file upload) in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T044 [P] Remove URL input UI elements no longer needed in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T045 Run quickstart.md manual testing checklist
- [x] T046 Verify all acceptance scenarios from spec.md are satisfied
- [x] T047 Code cleanup - remove any unused imports or dead code

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3, 4, 5)**: All depend on Foundational phase completion
  - US1 and US2 can proceed in parallel after Foundational
  - US3 depends on US1 (error handling for the upload flow)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independent of US1 (only needs GET endpoint)
- **User Story 3 (P2)**: Should complete after US1 since it adds error handling to the upload flow

### Within Each User Story

- API layer before presentation layer (US1)
- Core implementation before quality checks
- Story complete before moving to next priority

### Parallel Opportunities

- T001 and T002 can run in parallel
- T023, T029, T030 can run in parallel (different files)
- T043 and T044 can run in parallel (same file but independent changes)
- US1 API tasks (T008-T011) can complete while preparing presentation layer
- US2 can start in parallel with US1 after Foundational phase

---

## Parallel Example: User Story 1 API + Presentation

```bash
# After Foundational phase completes, launch API tasks:
Task: "Create POST endpoint for image upload in src/app/api/page-content-images/route.ts"

# Once T008 is complete, these can be parallelized:
Task: "Add hidden file input element for image selection in TiptapEditor.tsx"
Task: "Add isUploading state for loading indicator in TiptapEditor.tsx"
```

---

## Parallel Example: User Story 2 Tasks

```bash
# These can all run in parallel:
Task: "Create GET endpoint for serving images in src/app/api/page-content-images/[filename]/route.ts"
Task: "Verify .tiptap-image CSS class provides responsive sizing"
Task: "Verify public page content renders images correctly"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup (2 tasks)
2. Complete Phase 2: Foundational (5 tasks)
3. Complete Phase 3: User Story 1 (15 tasks)
4. Complete Phase 4: User Story 2 (11 tasks)
5. **STOP and VALIDATE**: Test image upload and public display independently
6. Deploy/demo if ready - basic image upload is functional

### Full Feature Delivery

1. Complete MVP above
2. Add Phase 5: User Story 3 - Error handling (9 tasks)
3. Complete Phase 6: Polish (5 tasks)
4. Full feature with validation and error feedback

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 and US2 are both Priority P1 - together they form the MVP
- US3 (P2) adds polish but feature is usable without it
- No test tasks included - tests not explicitly requested in specification
- Total: 47 tasks across 6 phases
