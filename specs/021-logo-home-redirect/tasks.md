# Tasks: Logo Home Redirect

**Input**: Design documents from `/specs/021-logo-home-redirect/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Not requested in feature specification. Tests will not be included.

**Organization**: Tasks are grouped by user story. This feature has a single user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `src/` at repository root (Next.js App Router structure)

---

## Phase 1: Setup

**Purpose**: No setup required - modifying existing component only

_No setup tasks needed. The project structure and dependencies are already in place._

---

## Phase 2: Foundational

**Purpose**: No foundational tasks required

_No foundational tasks needed. This feature modifies an existing component with no new infrastructure._

**Checkpoint**: Ready to proceed to User Story 1

---

## Phase 3: User Story 1 - Click Logo to Navigate Home (Priority: P1) MVP

**Goal**: Make the website logo in the public header clickable to navigate users to the home page ("/")

**Independent Test**: Click the logo from any public page and verify redirection to the home root ("/")

### Implementation for User Story 1

- [x] T001 [US1] Add Link import from next/link in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T002 [US1] Wrap first logo Image (empty menu path) in Link component pointing to "/" with aria-label in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T003 [US1] Wrap second logo Image (populated menu path) in Link component pointing to "/" with aria-label in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T004 [US1] Verify YAGNI compliance - only Link wrapper added, no extra features
- [x] T005 [US1] Verify DRY compliance - follows existing Link pattern from PublicHeaderMenuItem.tsx
- [x] T006 [US1] Verify KISS compliance - simple, readable implementation

**Checkpoint**: User Story 1 complete - logo click navigates to home page

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final validation

- [ ] T007 Manual verification: Click logo from any public page, verify navigation to "/"
- [ ] T008 Manual verification: Hover over logo, verify cursor changes to pointer
- [ ] T009 Manual verification: Ctrl+click logo, verify opens "/" in new tab
- [ ] T010 Manual verification: Test with screen reader, verify "Go to homepage" is announced
- [ ] T011 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: N/A - no setup needed
- **Foundational (Phase 2)**: N/A - no foundational tasks needed
- **User Story 1 (Phase 3)**: Can start immediately
- **Polish (Phase 4)**: Depends on User Story 1 completion

### Within User Story 1

- T001 (import) MUST complete before T002, T003
- T002 and T003 are sequential (same file, different locations)
- T004, T005, T006 are validation tasks after implementation

### Parallel Opportunities

- T002 and T003 cannot run in parallel (same file)
- T007, T008, T009, T010 can run in parallel (independent manual tests)

---

## Parallel Example: Polish Phase

```bash
# Launch all manual verification tasks together:
Task: "Manual verification: Click logo from any public page, verify navigation to '/'"
Task: "Manual verification: Hover over logo, verify cursor changes to pointer"
Task: "Manual verification: Ctrl+click logo, verify opens '/' in new tab"
Task: "Manual verification: Test with screen reader, verify 'Go to homepage' is announced"
```

---

## Implementation Strategy

### MVP (User Story 1)

1. Skip Phase 1 (no setup needed)
2. Skip Phase 2 (no foundational tasks)
3. Complete Phase 3: User Story 1 (T001-T006)
4. **STOP and VALIDATE**: Test logo click navigates to "/"
5. Complete Phase 4: Polish (T007-T011)

### Single File Modification

All implementation changes occur in one file:

- `src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx`

Changes:

1. Add `import Link from 'next/link'`
2. Wrap logo Image in Link at line ~43-51 (empty menu render)
3. Wrap logo Image in Link at line ~93-102 (populated menu render)

---

## Notes

- Single user story feature - very focused scope
- No tests required (not explicitly requested)
- No new files created - modifying existing component only
- Follow existing pattern from `PublicHeaderMenuItem.tsx` for Link usage
- Preserve existing logo styling and error handling
