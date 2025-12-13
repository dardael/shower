# Research: Sticky Footer Layout

**Feature**: 028-sticky-footer-layout  
**Date**: 2025-12-13

## Current Implementation Analysis

### Layout Structure

The current `PublicPageLayout.tsx` uses a sequential structure without a layout wrapper:

```tsx
return (
  <>
    <PublicHeaderMenu ... />
    <Container maxW="container.lg" py={8}>
      <Box>
        <PublicPageContent content={contentString} />
      </Box>
    </Container>
    <SocialNetworksFooter ... />
  </>
);
```

**Issues identified:**

- No wrapper element with `display: flex` and `flex-direction: column`
- No `min-height: 100vh` on the layout container
- Main content area doesn't have `flex: 1` to push footer down
- Footer floats immediately after content on short pages

### Background Color

Background color is applied via `BackgroundColorApplier` component in `provider.tsx`:

- Sets `document.body.style.backgroundColor` directly
- Works correctly but requires layout to fill viewport height

### Components Involved

| Component              | File Path                                                                          | Role                     |
| ---------------------- | ---------------------------------------------------------------------------------- | ------------------------ |
| PublicPageLayout       | `src/presentation/shared/components/PublicPageLayout/PublicPageLayout.tsx`         | Main layout wrapper      |
| PublicHeaderMenu       | `src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx`         | Header with nav          |
| SocialNetworksFooter   | `src/presentation/shared/components/SocialNetworksFooter/SocialNetworksFooter.tsx` | Footer                   |
| BackgroundColorApplier | In provider.tsx                                                                    | Applies bg color to body |

## Solution Research

### Decision: CSS Flexbox Sticky Footer

**Rationale**: The standard CSS flexbox sticky footer pattern is the simplest, most maintainable solution with excellent browser support.

**Pattern**:

```tsx
<Flex direction="column" minH="100vh">
  <Header /> {/* flex: 0 (natural height) */}
  <Box flex="1">
    {' '}
    {/* flex: 1 (grows to fill space) */}
    <Content />
  </Box>
  <Footer /> {/* flex: 0 (natural height) */}
</Flex>
```

**Alternatives Considered**:

| Alternative                                 | Rejected Because                                          |
| ------------------------------------------- | --------------------------------------------------------- |
| CSS Grid with `grid-template-rows`          | More complex syntax, flexbox is simpler for this use case |
| JavaScript height calculation               | Violates KISS principle, unnecessary complexity           |
| `position: fixed` footer                    | Overlaps content, not the desired behavior                |
| `min-height: calc(100vh - header - footer)` | Requires knowing exact heights, fragile                   |

### Browser Support

Flexbox with `min-height: 100vh` is supported in:

- Chrome 57+, Firefox 52+, Safari 10.1+, Edge 16+
- All modern browsers used by target audience

## Implementation Approach

### Changes Required

1. **PublicPageLayout.tsx**: Wrap content in `Flex` with `direction="column"` and `minH="100vh"`
2. **Main content wrapper**: Add `flex="1"` to expand and push footer down
3. **No changes needed**: Header, Footer, BackgroundColorApplier remain unchanged

### Chakra UI Implementation

```tsx
// PublicPageLayout.tsx
return (
  <Flex direction="column" minH="100vh">
    <PublicHeaderMenu ... />
    <Box flex="1">
      <Container maxW="container.lg" py={8}>
        <PublicPageContent content={contentString} />
      </Container>
    </Box>
    <SocialNetworksFooter ... />
  </Flex>
);
```

## Conclusion

The sticky footer layout can be achieved with minimal changes:

- Add one `Flex` wrapper component
- Add `flex="1"` to main content area
- No new files, no new dependencies, no JavaScript logic
