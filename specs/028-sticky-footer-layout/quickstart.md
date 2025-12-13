# Quickstart: Sticky Footer Layout

**Feature**: 028-sticky-footer-layout  
**Date**: 2025-12-13

## Overview

This feature implements a sticky footer layout for public pages, ensuring:

1. Footer stays at viewport bottom on short pages
2. Footer flows naturally after content on long pages
3. Background color fills the entire viewport from header to footer

## Implementation Summary

### Single File Change

Modify `src/presentation/shared/components/PublicPageLayout/PublicPageLayout.tsx`:

**Before:**

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

**After:**

```tsx
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

### Key Changes

| Change                    | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| `Flex direction="column"` | Vertical layout container                    |
| `minH="100vh"`            | Ensures layout fills viewport height         |
| `Box flex="1"`            | Main content expands to fill available space |

## Testing Checklist

- [ ] Short page: Footer at viewport bottom
- [ ] Long page: Footer flows after content
- [ ] Background color fills entire viewport
- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Responsive on mobile (320px)
- [ ] Responsive on desktop (1920px)

## Dependencies

- Chakra UI `Flex` and `Box` components (already available)
- No new packages required
