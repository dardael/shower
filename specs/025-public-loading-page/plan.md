# Implementation Plan: Public Loading Page

**Branch**: `025-public-loading-page` | **Date**: 2025-12-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/025-public-loading-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a loading indicator for public pages that displays while fetching all required data (menu, footer, and page content). The page transitions smoothly to display complete content only after all data is loaded, preventing layout shifts and partial content visibility. Tests will verify that the loading state persists until all data sources are complete.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: React 19, Chakra UI v3, existing data fetching hooks/utilities  
**Storage**: N/A (data fetched from existing APIs)  
**Testing**: Jest for integration tests (explicitly requested for loading state verification)  
**Target Platform**: Web browsers (modern evergreen browsers)  
**Project Type**: Web application with Next.js App Router  
**Performance Goals**: Loading indicator within 100ms, complete page render within 3 seconds under normal network conditions  
**Constraints**:

- No performance monitoring in production code (Principle III)
- Proper contrast ratios for loading indicator in light/dark modes (Principle VI)
- YAGNI: Implement only minimum required (no progress percentages, no complex animations) (Principle VII)
- DRY: Reuse existing loading components if available (Principle VIII)
- KISS: Simple spinner or progress indicator (Principle IX)
- Integration tests required to verify loading state behavior  
  **Scale/Scope**: All public pages (existing page routes under `/[slug]`), estimated 5-10 concurrent data fetching operations per page load

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### ✅ Principle I: Architecture-First Development

- **Status**: COMPLIANT
- **Rationale**: Loading state management will follow existing architecture patterns in the presentation layer. No new architectural patterns required.

### ✅ Principle II: Focused Testing Approach

- **Status**: COMPLIANT
- **Rationale**: Integration tests explicitly requested by user to verify loading state persists until all data is loaded. Tests will focus on common cases (successful load, slow network, failures) using real implementations where possible.

### ✅ Principle III: Simplicity-First Implementation

- **Status**: COMPLIANT
- **Rationale**: No performance monitoring in final code. Simple loading indicator without complex animations or performance metrics.

### ✅ Principle IV: Security by Default

- **Status**: COMPLIANT (N/A)
- **Rationale**: This feature affects public pages only, no admin functionality or authentication changes required.

### ✅ Principle V: Clean Architecture Compliance

- **Status**: COMPLIANT
- **Rationale**: Loading state logic will reside in presentation layer components, using existing application layer data fetching patterns. No changes to domain or infrastructure layers required.

### ✅ Principle VI: Accessibility-First Design

- **Status**: COMPLIANT
- **Rationale**: Loading indicator will use theme-aware Chakra UI components with proper contrast ratios for light/dark modes. ARIA live regions will announce loading states to screen readers.

### ✅ Principle VII: YAGNI (You Aren't Gonna Need It)

- **Status**: COMPLIANT
- **Rationale**: Implementing only the minimum required: basic loading indicator, parallel data fetching, error handling with retry. No progress percentages, no complex animations, no prefetching strategies.

### ✅ Principle VIII: DRY (Don't Repeat Yourself)

- **Status**: COMPLIANT
- **Rationale**: Will reuse existing Chakra UI Spinner component. Shared loading state logic will be extracted into a custom hook if needed.

### ✅ Principle IX: KISS (Keep It Simple, Stupid)

- **Status**: COMPLIANT
- **Rationale**: Simple implementation using standard React patterns (useState, useEffect) with Chakra UI Spinner. Clear, readable code structure.

**GATE RESULT**: ✅ ALL PRINCIPLES COMPLIANT - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── [slug]/
│       └── page.tsx                # Public page route - add loading state logic
├── presentation/
│   └── shared/
│       ├── components/
│       │   └── PublicPageLoader.tsx    # New: Loading indicator component
│       └── hooks/
│           └── usePublicPageData.tsx   # New: Hook to manage parallel data fetching
└── types/
    └── page-load-state.ts              # New: Type definitions for loading state

test/
└── integration/
    └── public-page-loading.integration.test.tsx  # New: Tests to verify loading behavior
```

**Structure Decision**: Using existing Next.js App Router structure. New loading components will be added to `presentation/shared` following the established pattern. Integration tests will be placed in `test/integration` to verify end-to-end loading behavior including data fetching coordination.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations - This section intentionally empty.

All constitution principles are compliant. No complexity tracking required.

---

## Phase 0: Research (COMPLETE)

**Artifacts**: `research.md`

### Research Questions Resolved:

1. ✅ How are menu, footer, and page content currently fetched?
2. ✅ Best practices for loading state management in React 19
3. ✅ Which Chakra UI loading components are available?
4. ✅ Integration testing strategy for loading states
5. ✅ Error handling and retry patterns

**Key Decisions**:

- Use custom hook `usePublicPageData` for coordinated data fetching
- Use Chakra UI `Spinner` component (theme-aware, accessible)
- Integration tests with React Testing Library
- Simple retry mechanism on error

---

## Phase 1: Design & Contracts (COMPLETE)

**Artifacts**: `data-model.md`, `contracts/api-coordination.md`, `quickstart.md`

### Data Model:

- `PageLoadState`: Loading state tracking
- `PageLoadError`: Error information
- `PublicPageData`: Aggregated data container

### API Contracts:

- No new API endpoints required
- Coordinates existing APIs: `GetMenuItems`, `GetPageContent`, various settings getters
- Parallel fetching with `Promise.allSettled`
- Timeout handling (10 seconds)

### Quickstart Guide:

- Component structure documented
- User experience flows defined
- Development checklist provided
- Constitution alignment verified

### Agent Context Updated:

✅ AGENTS.md updated with new technologies from this plan

---

## Post-Design Constitution Re-check

_Re-evaluating all principles after completing design phase_

### ✅ Principle I: Architecture-First Development

- **Status**: STILL COMPLIANT
- **Design Impact**: Loading logic stays in presentation layer. Uses existing application layer services. Clean separation maintained.

### ✅ Principle II: Focused Testing Approach

- **Status**: STILL COMPLIANT
- **Design Impact**: Integration tests specified in data-model.md. Focus on common cases. Minimal mocking (only data fetching functions).

### ✅ Principle III: Simplicity-First Implementation

- **Status**: STILL COMPLIANT
- **Design Impact**: No performance monitoring code in design. Simple Spinner component. No complex state machines.

### ✅ Principle IV: Security by Default

- **Status**: STILL COMPLIANT (N/A)
- **Design Impact**: Public pages only, no security implications.

### ✅ Principle V: Clean Architecture Compliance

- **Status**: STILL COMPLIANT
- **Design Impact**: Dependencies flow correctly: Presentation → Application → Domain → Infrastructure. No layer violations in design.

### ✅ Principle VI: Accessibility-First Design

- **Status**: STILL COMPLIANT
- **Design Impact**: Chakra UI Spinner ensures proper contrast. ARIA labels specified in quickstart. Theme-aware design documented.

### ✅ Principle VII: YAGNI

- **Status**: STILL COMPLIANT
- **Design Impact**: Minimal design - no progress bars, no complex animations, no caching strategies beyond requirement.

### ✅ Principle VIII: DRY

- **Status**: STILL COMPLIANT
- **Design Impact**: Reuses Chakra UI components. Single custom hook centralizes loading logic. No duplication in design.

### ✅ Principle IX: KISS

- **Status**: STILL COMPLIANT
- **Design Impact**: Simple React hooks pattern. Straightforward state management. Clear component hierarchy.

**POST-DESIGN GATE RESULT**: ✅ ALL PRINCIPLES STILL COMPLIANT

---

## Summary

**Planning Status**: ✅ COMPLETE

All phases complete and validated:

- ✅ Technical context defined
- ✅ Constitution check passed (pre and post design)
- ✅ Phase 0: Research complete (5 questions answered)
- ✅ Phase 1: Design complete (data model, contracts, quickstart)
- ✅ Agent context updated
- ✅ Post-design constitution re-check passed

**Artifacts Created**:

1. `/specs/025-public-loading-page/plan.md` (this file)
2. `/specs/025-public-loading-page/research.md`
3. `/specs/025-public-loading-page/data-model.md`
4. `/specs/025-public-loading-page/contracts/api-coordination.md`
5. `/specs/025-public-loading-page/quickstart.md`

**Ready for**: Phase 2 - Task generation (`/speckit.tasks` command)

**Key Implementation Files to Create**:

- `src/types/page-load-state.ts` - Type definitions
- `src/presentation/shared/components/PublicPageLoader.tsx` - Loading indicator component
- `src/presentation/shared/hooks/usePublicPageData.tsx` - Data fetching coordination hook
- `test/integration/public-page-loading.integration.test.tsx` - Integration tests

**Tests Required**:

- ✅ Loading indicator appears immediately
- ✅ Loading persists until all data loads
- ✅ No partial content visible during loading
- ✅ Error handling with retry
- ✅ Timeout handling
- ✅ Theme support (light/dark mode)
