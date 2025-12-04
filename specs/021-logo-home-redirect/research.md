# Research: Logo Home Redirect

**Feature**: 021-logo-home-redirect  
**Date**: 2025-01-04

## Research Summary

This feature is straightforward with no unknowns requiring research. The implementation follows established patterns already in use in the codebase.

## Decisions

### D1: Link Implementation Pattern

**Decision**: Use Next.js `Link` component with Chakra UI wrapping pattern  
**Rationale**: This pattern is already used in `PublicHeaderMenuItem.tsx` for navigation links. Consistency with existing codebase.  
**Alternatives considered**:

- Using `<a>` tag directly: Rejected - loses Next.js client-side navigation benefits
- Using Chakra UI `Link` only: Rejected - Next.js `Link` provides better performance with prefetching

### D2: Accessibility Implementation

**Decision**: Use `aria-label="Go to homepage"` on the link wrapper  
**Rationale**: Screen readers need context that the logo is a navigation element pointing home. The image already has `alt="Site logo"` but the link action needs clarification.  
**Alternatives considered**:

- Using `title` attribute: Not sufficient for screen readers
- Using visible text: Conflicts with visual design (logo-only appearance)

### D3: Logo Link Styling

**Decision**: No visual changes to logo, only add cursor pointer  
**Rationale**: Per FR-005, the logo must maintain its existing visual appearance. The pointer cursor (via Link behavior) indicates clickability.  
**Alternatives considered**:

- Adding hover effects (opacity, scale): Over-engineering per YAGNI principle
- Adding focus ring: Already handled by browser defaults for links

## No Unknowns

All technical aspects are resolved:

- Pattern exists in codebase (`PublicHeaderMenuItem.tsx`)
- Target path is confirmed ("/")
- Accessibility approach is standard
- No API or data changes needed
