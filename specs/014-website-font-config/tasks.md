# Tasks: Website Font Configuration

**Input**: Design documents from `/specs/014-website-font-config/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Explicitly requested in spec.md (TR-001, TR-002, TR-003). Unit tests for font CRUD operations and integration tests for font rendering on public/admin sides.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and domain layer foundation

- [x] T001 Add WEBSITE_FONT key to VALID_SETTING_KEYS in src/domain/settings/constants/SettingKeys.ts
- [x] T002 [P] Create font constants and metadata in src/domain/settings/constants/AvailableFonts.ts (AVAILABLE_FONTS array, DEFAULT_FONT, FontMetadata interface, FontCategory type)
- [x] T003 [P] Create WebsiteFont value object in src/domain/settings/value-objects/WebsiteFont.ts (validation, create(), createDefault(), getGoogleFontsUrl())
- [x] T004 Extend WebsiteSetting entity with createWebsiteFont() and createDefaultWebsiteFont() factory methods in src/domain/settings/entities/WebsiteSetting.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Application layer use cases, infrastructure, and API endpoints that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

### Application Layer

- [x] T005 [P] Create IGetWebsiteFont interface in src/application/settings/IGetWebsiteFont.ts
- [x] T006 [P] Create IUpdateWebsiteFont interface in src/application/settings/IUpdateWebsiteFont.ts
- [x] T007 [P] Create IGetAvailableFonts interface in src/application/settings/IGetAvailableFonts.ts
- [x] T008 Create GetWebsiteFont use case in src/application/settings/GetWebsiteFont.ts (implements IGetWebsiteFont)
- [x] T009 Create UpdateWebsiteFont use case in src/application/settings/UpdateWebsiteFont.ts (implements IUpdateWebsiteFont)
- [x] T010 Create GetAvailableFonts use case in src/application/settings/GetAvailableFonts.ts (implements IGetAvailableFonts)
- [x] T011 Update SettingsServiceLocator with getGetWebsiteFont(), getUpdateWebsiteFont(), getGetAvailableFonts() in src/application/settings/SettingsServiceLocator.ts

### Infrastructure Layer

- [x] T012 Add website-font default value handling in src/infrastructure/settings/repositories/MongooseWebsiteSettingsRepository.ts
- [x] T013 Register font use cases in dependency injection container in src/infrastructure/container.ts

### API Layer

- [x] T014 [P] Create API types (GetWebsiteFontResponse, UpdateWebsiteFontRequest, UpdateWebsiteFontResponse) in src/app/api/settings/website-font/types.ts
- [x] T015 Create website-font API route (GET public, POST authenticated) in src/app/api/settings/website-font/route.ts
- [x] T016 [P] Create available-fonts API route (GET public, cached 24h) in src/app/api/settings/available-fonts/route.ts

**Checkpoint**: Foundation ready - font can be stored/retrieved via API. User story implementation can now begin.

---

## Phase 3: User Story 1 - Select Website Font (Priority: P1) MVP

**Goal**: Administrator can select a font from the list and save it; the font applies to both public website and admin interface.

**Independent Test**: Navigate to font settings, select a font, save, verify font applies across public and admin.

### Unit Tests for User Story 1

> **Write these tests FIRST, ensure they FAIL before implementation**

- [x] T017 [P] [US1] Unit test for WebsiteFont value object (creation, validation, default, getGoogleFontsUrl) in test/unit/domain/settings/value-objects/WebsiteFont.test.ts
- [x] T018 [P] [US1] Unit test for GetWebsiteFont use case in test/unit/application/settings/GetWebsiteFont.test.ts
- [x] T019 [P] [US1] Unit test for UpdateWebsiteFont use case in test/unit/application/settings/UpdateWebsiteFont.test.ts

### Presentation Layer for User Story 1

- [x] T020 [P] [US1] Create WebsiteFontContext with provider and hook in src/presentation/shared/contexts/WebsiteFontContext.tsx
- [x] T021 [P] [US1] Create useWebsiteFont hook for fetching/caching font in src/presentation/shared/hooks/useWebsiteFont.ts
- [x] T022 [US1] Create FontProvider component (injects Google Fonts link, sets CSS variable) in src/presentation/shared/components/FontProvider.tsx
- [x] T023 [US1] Update theme.ts to use --website-font CSS variable for html/body font-family in src/presentation/shared/theme.ts
- [x] T024 [US1] Add FontProvider to provider hierarchy in src/presentation/shared/components/ui/provider.tsx
- [x] T025 [US1] Create FontSelector component (dropdown with category grouping) in src/presentation/admin/components/FontSelector.tsx
- [x] T026 [US1] Add FontSelector below ThemeColorSelector in WebsiteSettingsForm in src/presentation/admin/components/WebsiteSettingsForm.tsx

### Layout Integration for User Story 1

- [x] T027 [P] [US1] Verify font applies to public layout in src/app/layout.tsx (via FontProvider in provider chain)
- [x] T028 [P] [US1] Verify font applies to admin layout in src/app/admin/layout.tsx (via FontProvider in provider chain)

### Compliance Checks for User Story 1

- [x] T029 [US1] Verify YAGNI compliance - minimal implementation for current requirements only
- [x] T030 [US1] Verify DRY compliance - no code duplication, reuse existing patterns
- [x] T031 [US1] Verify KISS compliance - simple, readable code

**Checkpoint**: User Story 1 complete. Admin can select and save font, applied to both public and admin interfaces.

---

## Phase 4: User Story 2 - Font Preview (Priority: P2)

**Goal**: Administrator can preview fonts before committing, with sample text for headings and body.

**Independent Test**: Hover over or select different fonts and observe preview updates in real-time.

### Implementation for User Story 2

- [x] T032 [US2] Add font preview functionality to FontSelector with sample heading and body text in src/presentation/admin/components/FontSelector.tsx
- [x] T033 [US2] Dynamically load selected font for preview (inject temporary Google Fonts link) in src/presentation/admin/components/FontSelector.tsx
- [x] T034 [US2] Verify preview accurately represents final website appearance

### Compliance Checks for User Story 2

- [x] T035 [US2] Verify YAGNI compliance - preview only, no extra features
- [x] T036 [US2] Verify DRY compliance - reuse font loading logic from FontProvider
- [x] T037 [US2] Verify KISS compliance - simple preview mechanism

**Checkpoint**: User Story 2 complete. Admin can preview fonts before saving.

---

## Phase 5: User Story 3 - Font Persistence Across Sessions (Priority: P3)

**Goal**: Font selection persists and applies correctly when returning to settings or when visitors view the site.

**Independent Test**: Select font, log out, return to settings (shows saved selection), view public site (displays saved font).

### Integration Tests for User Story 3

> **Write these tests FIRST, ensure they FAIL before implementation**

- [x] T038 [P] [US3] Integration test for font CRUD operations via API in test/integration/website-font.integration.test.tsx
- [x] T039 [P] [US3] Integration test for font rendering on public pages in test/integration/website-font.integration.test.tsx
- [x] T040 [P] [US3] Integration test for font rendering on admin pages in test/integration/website-font.integration.test.tsx

### Implementation for User Story 3

- [x] T041 [US3] Ensure FontSelector displays current saved font on settings page load in src/presentation/admin/components/FontSelector.tsx
- [x] T042 [US3] Verify font loads correctly from database on page refresh (public and admin)
- [x] T043 [US3] Handle edge case: fallback to default font if saved font is invalid or fails to load

### Compliance Checks for User Story 3

- [x] T044 [US3] Verify YAGNI compliance - persistence only, no extra caching layers
- [x] T045 [US3] Verify DRY compliance - reuse existing settings persistence patterns
- [x] T046 [US3] Verify KISS compliance - straightforward load/save flow

**Checkpoint**: All user stories complete. Font selection persists across sessions.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and quality assurance

- [x] T047 [P] Verify contrast compliance for text with any selected font in both light and dark modes
- [x] T048 Run all unit tests and verify they pass: docker compose run --rm app npm run test
- [x] T049 Run linting and fix any issues: docker compose run --rm app npm run lint
- [x] T050 Run build and verify no errors: docker compose run --rm app npm run build
- [x] T051 Manual validation against quickstart.md test scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories should proceed in priority order (P1 → P2 → P3)
  - Each story builds on the previous
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Core functionality
- **User Story 2 (P2)**: Depends on US1 (FontSelector from US1) - Adds preview
- **User Story 3 (P3)**: Depends on US1 (core infrastructure) - Adds persistence validation

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Domain/Value objects before application layer
- Application layer before presentation layer
- Core implementation before integration

### Parallel Opportunities

**Setup (Phase 1)**:

```
T002 (AvailableFonts.ts) || T003 (WebsiteFont.ts)
```

**Foundational (Phase 2)**:

```
T005 (IGetWebsiteFont) || T006 (IUpdateWebsiteFont) || T007 (IGetAvailableFonts)
T014 (types.ts) || T016 (available-fonts route)
```

**User Story 1**:

```
T017 (WebsiteFont.test) || T018 (GetWebsiteFont.test) || T019 (UpdateWebsiteFont.test)
T020 (Context) || T021 (Hook)
T027 (public layout) || T028 (admin layout)
```

**User Story 3**:

```
T038 (CRUD test) || T039 (public test) || T040 (admin test)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T016)
3. Complete Phase 3: User Story 1 (T017-T031)
4. **STOP and VALIDATE**: Test font selection and application independently
5. Deploy/demo if ready - core feature complete

### Incremental Delivery

1. Setup + Foundational → API ready
2. Add User Story 1 → Test → Deploy (MVP - font selection works)
3. Add User Story 2 → Test → Deploy (font preview available)
4. Add User Story 3 → Test → Deploy (full persistence verified)
5. Polish → Final validation

### Task Count Summary

| Phase                 | Task Count | Description                      |
| --------------------- | ---------- | -------------------------------- |
| Phase 1: Setup        | 4          | Domain layer foundation          |
| Phase 2: Foundational | 12         | Application, Infrastructure, API |
| Phase 3: User Story 1 | 15         | Core font selection (MVP)        |
| Phase 4: User Story 2 | 6          | Font preview                     |
| Phase 5: User Story 3 | 9          | Persistence validation           |
| Phase 6: Polish       | 5          | Final validation                 |
| **Total**             | **51**     |                                  |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tests explicitly requested in spec.md (TR-001, TR-002, TR-003)
- Font applies to BOTH public and admin interfaces
- Font selector positioned BELOW theme color in settings
- Uses curated Google Fonts list (30 fonts across 5 categories)
- Default font is "Inter"
