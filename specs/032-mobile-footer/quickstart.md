# Quickstart: Mobile Footer for Public Side

**Feature**: 032-mobile-footer  
**Date**: 2025-12-14

## Overview

This guide provides step-by-step instructions for implementing mobile-optimized footer enhancements for the public showcase website.

## Prerequisites

- Existing `SocialNetworksFooter` component at `src/presentation/shared/components/SocialNetworksFooter/`
- Chakra UI v3 with responsive props support
- Understanding of the 768px mobile/desktop breakpoint pattern

## Implementation Steps

### Step 1: Enhance SocialNetworkItem Touch Targets

**File**: `src/presentation/shared/components/SocialNetworksFooter/SocialNetworkItem.tsx`

Add minimum touch target sizing to the link wrapper:

```tsx
// Add to the Link or clickable wrapper component
minW = '44px';
minH = '44px';
display = 'flex';
alignItems = 'center';
justifyContent = 'center';
```

This ensures all interactive elements meet the 44x44px accessibility requirement on mobile.

### Step 2: Add Responsive Spacing to Footer

**File**: `src/presentation/shared/components/SocialNetworksFooter/SocialNetworksFooter.tsx`

Update spacing to be responsive:

```tsx
// Change fixed gap to responsive
gap={{ base: 4, md: 3 }}  // 16px on mobile, 12px on desktop

// Ensure padding is mobile-optimized
py={{ base: 6, md: 8 }}
px={{ base: 4, md: 8 }}
```

### Step 3: Verify Focus Indicators

Ensure all interactive elements have visible focus states:

```tsx
// Links should have focus-visible styling
_focusVisible={{
  outline: '2px solid',
  outlineColor: 'colorPalette.500',
  outlineOffset: '2px',
}}
```

### Step 4: Test Responsive Behavior

1. Open browser DevTools
2. Toggle device toolbar (mobile view)
3. Test at various widths: 320px, 375px, 414px, 768px
4. Verify:
   - No horizontal scrolling
   - Touch targets are easily tappable
   - Layout transitions smoothly at 768px breakpoint

## Files to Modify

| File                       | Changes                                  |
| -------------------------- | ---------------------------------------- |
| `SocialNetworkItem.tsx`    | Add touch target sizing (minW/minH 44px) |
| `SocialNetworksFooter.tsx` | Responsive spacing adjustments           |

## Testing Checklist

- [ ] Footer displays without horizontal scroll on 320px viewport
- [ ] Touch targets are at least 44x44px (use DevTools to measure)
- [ ] Focus indicators visible on keyboard navigation
- [ ] Layout transitions smoothly when resizing browser
- [ ] Works correctly in both light and dark modes
- [ ] Empty state handled gracefully (no social networks configured)

## Common Patterns Reference

### Responsive Props (Chakra UI)

```tsx
// Mobile-first responsive values
property={{ base: 'mobileValue', md: 'desktopValue' }}
```

### Touch Target Pattern (from Mobile Header Menu)

```tsx
<IconButton
  minW="44px"
  minH="44px"
  aria-label="descriptive label"
  // ...
/>
```

### Mobile Detection (if needed)

```tsx
import { useBreakpointValue } from '@chakra-ui/react';

const isMobile = useBreakpointValue({ base: true, md: false });
```

## Success Criteria Validation

| Criterion                             | How to Verify                                  |
| ------------------------------------- | ---------------------------------------------- |
| SC-001: No horizontal scroll >= 320px | DevTools mobile view at 320px width            |
| SC-002: 44x44px touch targets         | DevTools element inspector, measure dimensions |
| SC-003: Transition < 300ms            | Visual observation when resizing               |
| SC-004: Keyboard accessible           | Tab through all footer links                   |
| SC-005: WCAG AA contrast              | Use contrast checker tool                      |
| SC-006: Sticky footer                 | View page with minimal content                 |
