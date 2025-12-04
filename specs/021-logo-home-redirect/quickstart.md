# Quickstart: Logo Home Redirect

**Feature**: 021-logo-home-redirect  
**Date**: 2025-01-04

## Overview

Make the website logo in the public header clickable to navigate to the home page ("/").

## Implementation Steps

### Step 1: Modify PublicHeaderMenu.tsx

Wrap the logo `Image` component with a Next.js `Link` component in both render paths (empty menu and populated menu):

**File**: `src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx`

**Changes**:

1. Import `Link` from `next/link`
2. Wrap each logo `Image` in a `Link` component pointing to "/"
3. Add `aria-label="Go to homepage"` for accessibility
4. Ensure the link maintains existing logo styling

### Code Pattern

Follow the existing pattern from `PublicHeaderMenuItem.tsx`:

```tsx
import Link from 'next/link';

// Wrap the logo Image like this:
{
  logo && !logoError && (
    <Link href="/" aria-label="Go to homepage">
      <Image
        src={logo.url}
        alt="Site logo"
        h={{ base: '32px', md: '40px' }}
        w="auto"
        objectFit="contain"
        flexShrink={0}
        onError={() => setLogoError(true)}
        cursor="pointer"
      />
    </Link>
  );
}
```

## Verification

1. Navigate to any public page
2. Click the logo - should redirect to "/"
3. Hover over logo - cursor should change to pointer
4. Ctrl+click logo - should open "/" in new tab
5. Test with screen reader - should announce "Go to homepage" link

## Files Modified

| File                                                                       | Change                                          |
| -------------------------------------------------------------------------- | ----------------------------------------------- |
| `src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx` | Wrap logo Image in Link component (2 locations) |

## No Additional Setup Required

- No database migrations
- No environment variables
- No new dependencies
- No API changes
