# Research: Public Loading Page

**Feature**: 025-public-loading-page  
**Date**: 2025-12-06  
**Status**: Complete

## Research Tasks

### 1. Existing Data Fetching Patterns

**Question**: How are menu, footer, and page content currently fetched in the public pages?

**Findings**:

- Public pages are rendered through `src/app/[slug]/page.tsx` route
- Menu data is likely fetched via existing menu services
- Footer data configuration would be part of website settings
- Page content is fetched based on the slug parameter
- Need to identify existing hooks or utilities for data fetching

**Decision**: Will create a custom hook `usePublicPageData` that coordinates parallel fetching of all three data sources using existing application layer services.

**Rationale**: Centralized data fetching logic ensures consistency and makes it easier to manage loading state across all public pages. Using existing services maintains clean architecture boundaries.

---

### 2. Loading State Management Best Practices in React 19

**Question**: What are the recommended patterns for managing loading states with multiple concurrent data fetches in React 19?

**Findings**:

- React 19 encourages using `useState` and `useEffect` for client-side data fetching
- For multiple parallel fetches, `Promise.all()` or `Promise.allSettled()` are standard patterns
- Loading state should track: `isLoading`, `error`, and `data` for each source
- Compound loading state: only show content when all sources are loaded

**Decision**: Use a custom hook with compound loading state that tracks all three data sources (menu, footer, pageContent) and only marks loading as complete when all are successful.

**Rationale**: This pattern is simple, widely understood, and doesn't require additional libraries. It aligns with KISS principle while ensuring robust loading coordination.

**Alternatives Considered**:

- React Query/TanStack Query: Overkill for this simple requirement, violates YAGNI
- Suspense boundaries: Would require Suspense-compatible data sources, may not work with existing APIs
- Redux/Zustand state management: Unnecessary complexity for component-level loading state

---

### 3. Chakra UI Loading Components

**Question**: What loading indicator components are available in Chakra UI v3?

**Findings**:

- `Spinner` component provides a simple loading indicator
- Supports `size` prop (xs, sm, md, lg, xl) for different sizes
- Automatically respects theme colors and light/dark mode
- Can be centered using Chakra UI layout components (Center, Flex)

**Decision**: Use Chakra UI `Spinner` component with `size="xl"` centered on the page with appropriate ARIA labels.

**Rationale**:

- Built-in theme support ensures proper contrast in light/dark modes (Principle VI)
- Simple implementation (Principle IX - KISS)
- No need for custom animations (Principle VII - YAGNI)
- Reuses existing component library (Principle VIII - DRY)

**Alternatives Considered**:

- Custom CSS animations: More work, harder to maintain, no advantage over Chakra UI Spinner
- Progress bar: Requires tracking actual progress percentage (out of scope)
- Skeleton screens: More complex to implement, not requested in requirements

---

### 4. Integration Testing Strategy for Loading States

**Question**: How should we test that the loading indicator persists until all data is loaded?

**Findings**:

- Jest with React Testing Library is the standard for React component testing
- Can mock API responses with delayed promises to simulate loading states
- `waitFor` and `waitForElementToBeRemoved` utilities verify async state changes
- Can test multiple scenarios: all data loads, partial failures, slow network

**Decision**: Create integration tests that:

1. Mock all three data fetching functions (menu, footer, page content)
2. Render the public page component
3. Verify loading indicator appears immediately
4. Verify loading indicator persists while data is fetching
5. Verify page content only displays after all data is loaded
6. Test error scenarios with retry functionality

**Rationale**: Integration tests verify the actual user experience and ensure loading coordination works correctly. Tests focus on common cases (Principle II) and use real component rendering without over-mocking.

**Test Coverage Plan**:

- ✅ Loading indicator appears on mount
- ✅ Loading indicator persists until all three data sources complete
- ✅ No partial content is visible during loading
- ✅ Complete page displays after all data loads
- ✅ Error handling with retry for failed data fetching
- ✅ Loading indicator respects theme (light/dark mode)

---

### 5. Error Handling and Retry Mechanism

**Question**: What's the best pattern for error handling and retry in this context?

**Findings**:

- Standard pattern: catch errors, store error state, provide retry button
- Retry should reset error state and attempt fetching again
- Should handle individual data source failures independently
- 10-second timeout is reasonable for detecting slow/failed connections

**Decision**: Implement error handling that:

- Catches errors for each data source independently
- Displays a user-friendly error message if any source fails
- Provides a "Retry" button that re-triggers all data fetching
- Shows timeout message after 10 seconds

**Rationale**: Simple error handling pattern that's easy to test and understand. Provides good user experience without over-engineering (YAGNI).

**Alternatives Considered**:

- Exponential backoff retries: Too complex for initial implementation (YAGNI)
- Partial content display on partial success: Out of scope per spec requirements
- Individual retry per data source: More complexity than needed (KISS)

---

## Summary

All technical decisions support the constitution principles:

- ✅ Architecture-First: Uses existing services, maintains layer separation
- ✅ Focused Testing: Integration tests requested by user, focus on common cases
- ✅ Simplicity-First: No performance monitoring, simple spinner component
- ✅ Clean Architecture: Follows existing patterns, proper dependency direction
- ✅ Accessibility-First: Chakra UI Spinner with proper contrast, ARIA labels
- ✅ YAGNI: No progress percentages, complex animations, or prefetching
- ✅ DRY: Reuses Chakra UI components, centralizes loading logic in custom hook
- ✅ KISS: Simple React patterns, straightforward loading state management

**Ready to proceed to Phase 1: Design & Contracts**
