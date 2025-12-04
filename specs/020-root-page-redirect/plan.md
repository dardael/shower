# Implementation Plan: Root Page Redirect to First Menu Item

**Branch**: `020-root-page-redirect` | **Date**: 2025-12-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/020-root-page-redirect/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement functionality to automatically display the first menu item's page content when visitors access the root URL ("/"). The system will identify the first menu item by position/order, retrieve its associated page content, and render it at the root URL without redirecting. This ensures a seamless landing experience where the homepage always shows the primary content defined by the first menu item's ordering.

**User Request**: "add tests to verify than the root url diplsay the first menu content"

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: React 19, Chakra UI v3, Mongoose for MongoDB, tsyringe for DI  
**Storage**: MongoDB via Mongoose (existing menu items and page content)  
**Testing**: Jest for unit tests and integration tests (explicitly requested for this feature)  
**Target Platform**: Web application (Next.js server-side rendering)  
**Project Type**: Web application with Next.js App Router structure  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Showcase website builder supporting multiple menu items and pages per site

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### ✅ Architecture-First Development

- **Status**: PASS
- **Justification**: Implementation will follow existing DDD and Hexagonal Architecture patterns. Changes will be isolated to the Next.js App Router page component (`src/app/page.tsx`), leveraging existing Application layer use cases (`GetMenuItems`, `GetPageContent`) and Domain layer entities (`MenuItem`, `PageContent`). No new layers or architectural changes needed.

### ✅ Focused Testing Approach

- **Status**: PASS (Testing explicitly requested by user)
- **Justification**: User specifically requested: "add tests to verify than the root url diplsay the first menu content". Tests will be unit tests and integration tests focused on common cases: root URL displaying first menu content, handling no menu items, and verifying correct menu item selection. Will use real implementations with minimal mocking (only external dependencies).

### ✅ Simplicity-First Implementation

- **Status**: PASS
- **Justification**: No performance monitoring will be added. Implementation focuses on straightforward logic: query first menu item, retrieve content, render component. Simple approach without unnecessary complexity.

### ✅ Security by Default

- **Status**: PASS
- **Justification**: Root URL is a public endpoint displaying public page content. No authentication required. Existing security controls remain unchanged. No sensitive data exposure.

### ✅ Clean Architecture Compliance

- **Status**: PASS
- **Justification**: Will maintain existing clean architecture with proper separation. Page component (Presentation layer) calls Application layer use cases, which use Domain entities. Dependencies flow inward. No violations of SOLID principles.

### ✅ Accessibility-First Design

- **Status**: PASS
- **Justification**: Root URL will render existing `PublicPageContent` component which already implements proper contrast ratios and theme support. No new accessibility concerns introduced. Reuses tested component with light/dark mode support.

### ✅ YAGNI (You Aren't Gonna Need It)

- **Status**: PASS
- **Justification**: Implementation only adds minimal required functionality: display first menu item's content at root URL. No speculative features like custom homepage configuration, URL parameter handling, or advanced caching strategies.

### ✅ DRY (Don't Repeat Yourself)

- **Status**: PASS
- **Justification**: Will reuse existing use cases (`GetMenuItems`, `GetPageContent`) and components (`PublicPageContent`). Logic for retrieving first menu item will be implemented once in root page component. No code duplication.

### ✅ KISS (Keep It Simple, Stupid)

- **Status**: PASS
- **Justification**: Straightforward implementation: get menu items, find first by position, get its page content, render. Simple control flow without complex abstractions or error handling beyond graceful degradation.

## Project Structure

### Documentation (this feature)

```text
specs/020-root-page-redirect/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── spec.md              # Feature specification
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── page.tsx                          # ROOT URL HANDLER - Modified to display first menu content
│   ├── [slug]/
│   │   └── page.tsx                      # Existing dynamic page handler (reference)
│   └── layout.tsx                        # Root layout (unchanged)
├── application/
│   ├── menu/
│   │   ├── GetMenuItems.ts               # Existing use case (reused)
│   │   └── IGetMenuItems.ts              # Existing interface (reused)
│   └── pages/
│       ├── use-cases/
│       │   ├── GetPageContent.ts         # Existing use case (reused)
│       │   └── IGetPageContent.ts        # Existing interface (reused)
├── domain/
│   ├── menu/
│   │   └── entities/
│   │       └── MenuItem.ts               # Existing entity with position property (reused)
│   └── pages/
│       └── PageContent.ts                # Existing entity (reused)
└── presentation/
    └── shared/
        └── components/
            └── PublicPageContent/
                └── PublicPageContent.tsx # Existing component (reused)

test/
├── integration/
│   └── root-page-redirect.integration.test.tsx  # NEW - Integration test for root URL
└── unit/
    └── app/
        └── page.test.tsx                        # NEW - Unit test for root page component
```

**Structure Decision**: Web application using Next.js App Router structure. Implementation primarily modifies `src/app/page.tsx` (currently displays static welcome message) to dynamically load and display first menu item's page content. Reuses existing Application and Domain layers with no structural changes. Tests added following existing convention (integration tests in `test/integration/`, unit tests mirror source structure in `test/unit/app/`).

## Complexity Tracking

No constitution violations requiring justification.

## Phase 0: Research & Technical Discovery

### Research Tasks

1. **Next.js App Router Root Page Patterns**
   - Research: How to implement dynamic content in root `page.tsx` while maintaining server-side rendering
   - Goal: Understand best practices for root route handling vs dynamic `[slug]` routes
   - Artifacts: Document approach for sharing logic between root and slug pages

2. **Menu Item Ordering/Position Retrieval**
   - Research: Verify existing `MenuItem` entity has position/order field
   - Research: Confirm `GetMenuItems` use case returns items in position order
   - Goal: Determine if additional sorting logic is needed or if use case already handles it
   - Artifacts: Document current implementation and any required modifications

3. **Edge Case Handling Patterns**
   - Research: Best practices for handling empty menu items, missing page content
   - Research: Review existing error handling in `[slug]/page.tsx` for consistency
   - Goal: Ensure graceful degradation matches existing patterns
   - Artifacts: Document error handling approach for edge cases

4. **Testing Patterns for Next.js App Router Pages**
   - Research: Current testing approach for server components in the codebase
   - Research: Mock strategies for dependency injection container in tests
   - Goal: Align test structure with existing patterns (`test/unit/app/layout.test.tsx`)
   - Artifacts: Document testing strategy and mock patterns

### Research Output Location

All research findings will be consolidated in: `specs/020-root-page-redirect/research.md`

## Phase 1: Design & Implementation Contracts

### Data Model

**Location**: `specs/020-root-page-redirect/data-model.md`

No new entities required. Feature reuses existing domain model:

- **MenuItem** (existing): Contains `position` property for ordering, `url` for page association, `id` for content lookup
- **PageContent** (existing): Contains `content` property with HTML string, associated with menu item by ID

**Key Relationships**:

- MenuItem.id → PageContent (one-to-one relationship, already established)
- MenuItem.position → Determines first menu item (sorting criteria)

### API Contracts

**Location**: `specs/020-root-page-redirect/contracts/`

No new API endpoints required. Feature reuses existing internal interfaces:

**Internal Use Cases** (Application layer):

```typescript
// Existing interfaces - no changes needed
interface IGetMenuItems {
  execute(): Promise<MenuItem[]>;
}

interface IGetPageContent {
  execute(pageId: string): Promise<PageContent | null>;
}
```

**Page Component Contract** (Presentation layer):

```typescript
// src/app/page.tsx
export default async function Home(): Promise<JSX.Element>;
// Server component that:
// 1. Resolves IGetMenuItems from DI container
// 2. Calls execute() to get all menu items
// 3. Identifies first menu item by position (min position value)
// 4. Resolves IGetPageContent from DI container
// 5. Calls execute(menuItem.id) to get page content
// 6. Renders PublicPageContent component with content
// 7. Handles edge cases (no menu items, no page content)
```

### Quickstart Guide

**Location**: `specs/020-root-page-redirect/quickstart.md`

Will include:

1. How to verify root URL displays first menu content
2. How to test edge cases (empty menus, missing content)
3. How to run integration and unit tests
4. Expected behavior for visitors and content managers

## Phase 2: Implementation Tasks

**Note**: Detailed tasks are created by `/speckit.tasks` command, not by `/speckit.plan`.

High-level implementation breakdown:

1. **Modify Root Page Component** (`src/app/page.tsx`)
   - Replace static welcome content with dynamic first menu item logic
   - Query menu items using existing `GetMenuItems` use case
   - Sort by position to identify first item
   - Retrieve page content using existing `GetPageContent` use case
   - Render using existing `PublicPageContent` component
   - Handle edge cases with user-friendly messages

2. **Create Integration Tests** (`test/integration/root-page-redirect.integration.test.tsx`)
   - Test: Root URL displays first menu item's content
   - Test: Root URL updates when menu order changes
   - Test: Root URL shows placeholder when no menu items exist
   - Test: Root URL handles missing page content gracefully
   - Test: Page metadata matches first menu item

3. **Create Unit Tests** (`test/unit/app/page.test.tsx`)
   - Test: Correct menu item identification (lowest position)
   - Test: Proper use case invocation
   - Test: Component rendering with mock data
   - Test: Edge case handling (no items, null content)

4. **Verify Existing Components**
   - Confirm `PublicPageContent` handles empty content gracefully
   - Verify theme consistency with existing page rendering

## Success Criteria Validation

Reference spec.md success criteria:

- **SC-001**: Page content loads within 2 seconds → Reuses existing page content loading mechanism with same performance characteristics
- **SC-002**: 100% visitors see first menu content → Implementation ensures content displays for any menu configuration
- **SC-003**: Menu reordering reflected within 5 seconds → Next.js server-side rendering ensures immediate reflection (no caching layer)
- **SC-004**: Same performance as dedicated page URLs → Uses identical use cases and components as `[slug]/page.tsx`
- **SC-005**: Site owners can verify homepage matches first menu item → Straightforward position-based selection (lowest position number = first item)

## Next Steps

1. Run `/speckit.plan` to generate Phase 0 research.md
2. Complete research tasks documented above
3. Generate Phase 1 deliverables (data-model.md, contracts/, quickstart.md)
4. Run `/speckit.tasks` to create detailed implementation checklist
5. Execute implementation tasks
6. Run tests to validate success criteria
