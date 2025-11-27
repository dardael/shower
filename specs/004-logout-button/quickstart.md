# Quickstart Guide: Admin Logout Button

**Feature**: 004-logout-button  
**Date**: 2025-11-27  
**For**: Developers implementing the logout button feature

## Overview

This guide provides step-by-step instructions for implementing the admin logout button feature. The feature adds a logout button to the admin sidebar that allows administrators to end their session and redirect to the login page.

## Prerequisites

- Existing LogoutButton component at `/src/presentation/shared/components/LogoutButton.tsx`
- BetterAuth authentication configured and working
- Admin sidebar component at `/src/presentation/admin/components/AdminSidebar.tsx`
- DarkModeToggle component for visual reference
- Docker and Docker Compose for local development

## Implementation Steps

### Step 1: Review Existing Implementation

**Duration**: 10 minutes

The LogoutButton component already exists but needs to be converted to an IconButton format and placed in the admin sidebar.

```bash
# Review existing component
cat src/presentation/shared/components/LogoutButton.tsx

# Review admin sidebar for placement
cat src/presentation/admin/components/AdminSidebar.tsx

# Review dark mode toggle for visual reference
cat src/presentation/shared/components/DarkModeToggle.tsx
```

**Key Files**:

- `/src/presentation/shared/components/LogoutButton.tsx` - Existing logout button
- `/src/infrastructure/auth/adapters/BetterAuthClientAdapter.ts` - Logout service
- `/src/presentation/admin/components/AdminSidebar.tsx` - Target location

### Step 2: Convert LogoutButton to IconButton Format

**Duration**: 20 minutes

Update the LogoutButton component to match the DarkModeToggle styling as a round icon button.

**File**: `/src/presentation/shared/components/LogoutButton.tsx`

**Changes Required**:

1. Add loading state with `useState`
2. Convert from `Button` to `IconButton`
3. Match DarkModeToggle styling pattern
4. Add `useLogger` for error logging
5. Size icon appropriately (`size={16-18}`)

**Example Implementation**:

```typescript
'use client';

import { IconButton } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import { BetterAuthClientAdapter } from '@/infrastructure/auth/adapters/BetterAuthClientAdapter';
import { useRouter } from 'next/navigation';
import { useLogger } from '@/presentation/shared/hooks/useLogger';

const authClient = new BetterAuthClientAdapter();

export default function LogoutButton() {
  const router = useRouter();
  const logger = useLogger();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);

    try {
      await authClient.signOut();
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout failed, clearing local session', error);
    } finally {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <IconButton
      onClick={handleSignOut}
      aria-label="Sign out"
      title="Sign out"
      variant="ghost"
      size="sm"
      boxSize="8"
      loading={isLoading}
      disabled={isLoading}
      _hover={{
        bg: 'bg.muted',
        borderColor: 'border.emphasized',
      }}
      _focusVisible={{
        ring: '2px',
        ringColor: 'border.emphasized',
        ringOffset: '2px',
      }}
    >
      <FiLogOut color="currentColor" />
    </IconButton>
  );
}
```

**Verify**:

```bash
# Check TypeScript compilation
docker compose run --rm app npm run build

# Check formatting
docker compose run --rm app npm run format
```

### Step 3: Add LogoutButton to AdminSidebar

**Duration**: 15 minutes

Position the LogoutButton next to the DarkModeToggle in the admin sidebar.

**File**: `/src/presentation/admin/components/AdminSidebar.tsx`

**Find the DarkModeToggle location** (typically in a control section or footer):

```typescript
// Look for this pattern in AdminSidebar.tsx
<DarkModeToggle />
```

**Add LogoutButton next to it**:

```typescript
import LogoutButton from '@/presentation/shared/components/LogoutButton';

// In the component render:
<HStack gap={2}>
  <DarkModeToggle />
  <LogoutButton />
</HStack>
```

**Alternative Placement Options** (choose based on current sidebar structure):

Option 1 - Horizontal Group (Recommended):

```typescript
<HStack gap={2} justify="center">
  <LogoutButton />
  <DarkModeToggle />
</HStack>
```

Option 2 - Vertical Stack:

```typescript
<VStack gap={2}>
  <LogoutButton />
  <DarkModeToggle />
</VStack>
```

**Verify**:

```bash
# Start the dev server (must be run manually by user)
# docker compose up app

# Navigate to http://localhost:3000/admin
# Verify logout button appears next to dark mode toggle
```

### Step 4: Test Logout Functionality

**Duration**: 15 minutes

**Manual Testing**:

1. **Successful Logout**:

   ```
   - Navigate to http://localhost:3000/admin
   - Authenticate as admin
   - Click the logout button
   - Verify loading state shows
   - Verify redirect to login page
   - Attempt to access /admin directly
   - Verify redirect back to login page
   ```

2. **Visual Consistency**:

   ```
   - Check light mode: button visible with proper contrast
   - Toggle to dark mode: button visible with proper contrast
   - Compare with DarkModeToggle: similar size, shape, spacing
   - Hover over button: proper hover state
   - Focus button with keyboard: focus ring visible
   ```

3. **Edge Cases**:
   ```
   - Click logout multiple times rapidly (should be disabled during loading)
   - Simulate network failure (disconnect, click logout, should still redirect)
   - Browser back button after logout (should redirect to login)
   ```

**Browser Console Checks**:

```javascript
// After clicking logout, check console for:
// - "User logged out successfully" (info log)
// - No errors or warnings
// - Session cookies cleared (Application tab → Cookies)
```

### Step 5: Unit Tests (Only if Explicitly Requested)

**Duration**: 30 minutes

Per the constitution, tests are written only when explicitly requested. If tests are needed:

**Create Test File**: `/test/unit/presentation/shared/components/LogoutButton.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogoutButton from '@/presentation/shared/components/LogoutButton';
import { BetterAuthClientAdapter } from '@/infrastructure/auth/adapters/BetterAuthClientAdapter';
import { useRouter } from 'next/navigation';
import { useLogger } from '@/presentation/shared/hooks/useLogger';

jest.mock('@/infrastructure/auth/adapters/BetterAuthClientAdapter');
jest.mock('next/navigation');
jest.mock('@/presentation/shared/hooks/useLogger');

describe('LogoutButton', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockLogger = { info: jest.fn(), error: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
    (useLogger as jest.Mock).mockReturnValue(mockLogger);
  });

  it('renders logout button with correct aria-label', () => {
    render(<LogoutButton />);
    expect(screen.getByLabelText('Sign out')).toBeInTheDocument();
  });

  it('calls signOut and redirects on click', async () => {
    const mockSignOut = jest.fn().mockResolvedValue(undefined);
    (BetterAuthClientAdapter as jest.Mock).mockImplementation(() => ({
      signOut: mockSignOut,
    }));

    render(<LogoutButton />);

    fireEvent.click(screen.getByLabelText('Sign out'));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('User logged out successfully');
      expect(mockPush).toHaveBeenCalledWith('/admin');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('handles logout error gracefully', async () => {
    const mockSignOut = jest.fn().mockRejectedValue(new Error('Network error'));
    (BetterAuthClientAdapter as jest.Mock).mockImplementation(() => ({
      signOut: mockSignOut,
    }));

    render(<LogoutButton />);

    fireEvent.click(screen.getByLabelText('Sign out'));

    await waitFor(() => {
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Logout failed, clearing local session',
        expect.any(Error)
      );
      expect(mockPush).toHaveBeenCalledWith('/admin');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('disables button during logout', async () => {
    const mockSignOut = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    (BetterAuthClientAdapter as jest.Mock).mockImplementation(() => ({
      signOut: mockSignOut,
    }));

    render(<LogoutButton />);
    const button = screen.getByLabelText('Sign out');

    fireEvent.click(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
```

**Run Tests**:

```bash
docker compose run --rm app npm run test -- LogoutButton.test.tsx
```

### Step 6: Verify Accessibility

**Duration**: 10 minutes

**Keyboard Navigation**:

1. Tab to the logout button
2. Verify focus ring appears
3. Press Enter or Space
4. Verify logout occurs

**Screen Reader** (if available):

1. Navigate to logout button
2. Verify announces "Sign out button"
3. Verify loading state announced

**Color Contrast**:

1. Use browser DevTools or contrast checker
2. Verify icon contrast ratio ≥ 4.5:1 in light mode
3. Verify icon contrast ratio ≥ 4.5:1 in dark mode

### Step 7: Code Quality Checks

**Duration**: 5 minutes

```bash
# Run linting
docker compose run --rm app npm run lint

# Run formatting
docker compose run --rm app npm run format

# TypeScript strict mode check
docker compose run --rm app npm run build:strict

# Final build
docker compose run --rm app npm run build
```

All checks must pass before proceeding.

### Step 8: Final Verification

**Checklist**:

- [ ] LogoutButton converted to IconButton format
- [ ] LogoutButton positioned next to DarkModeToggle in sidebar
- [ ] Visual consistency with DarkModeToggle (size, shape, spacing)
- [ ] Loading state displays during logout
- [ ] Successful logout redirects to login page
- [ ] Error logging implemented
- [ ] Graceful error handling (always redirects)
- [ ] Proper contrast in light and dark modes
- [ ] Keyboard accessible (focus ring, Enter/Space work)
- [ ] ARIA labels present (`aria-label="Sign out"`)
- [ ] TypeScript strict mode passes
- [ ] Linting passes
- [ ] Formatting passes
- [ ] Build succeeds
- [ ] Manual testing complete
- [ ] Unit tests pass (if requested)

## Common Issues and Solutions

### Issue: Button not visible in sidebar

**Solution**: Check AdminSidebar.tsx structure. Verify import path is correct. Check that component is exported as default.

### Issue: Logout redirects but session persists

**Solution**: Verify `router.refresh()` is called after redirect. Check BetterAuth session configuration.

### Issue: Icon color wrong in dark mode

**Solution**: Use `color="currentColor"` on FiLogOut icon. Verify Chakra semantic color tokens used.

### Issue: Button too large/small compared to DarkModeToggle

**Solution**: Match exact props: `size="sm"` and `boxSize="8"` on IconButton.

### Issue: TypeScript errors about missing types

**Solution**: Run `docker compose run --rm app npm install` to ensure all types installed.

## Development Commands Reference

```bash
# Install dependencies
docker compose run --rm app npm install

# Start dev server (must be run manually by user)
docker compose up app

# Run tests (only if explicitly requested)
docker compose run --rm app npm run test

# Run linting
docker compose run --rm app npm run lint

# Format code
docker compose run --rm app npm run format

# Build project
docker compose run --rm app npm run build

# TypeScript strict check
docker compose run --rm app npm run build:strict
```

## Next Steps

After implementation:

1. **Create Pull Request**: Commit changes to `004-logout-button` branch
2. **Request Review**: Ensure constitution compliance verified
3. **Merge to Main**: After approval and all checks pass

## Support

- **Specification**: See `/specs/004-logout-button/spec.md`
- **Research**: See `/specs/004-logout-button/research.md`
- **Data Model**: See `/specs/004-logout-button/data-model.md`
- **API Contracts**: See `/specs/004-logout-button/contracts/api-contracts.md`
- **Architecture**: See `AGENTS.md` for architecture guidelines

## Estimated Time

- **Total Implementation**: 1.5 - 2 hours
- **Testing (if requested)**: +30 minutes
- **Code Review**: 30 minutes

**Total**: 2 - 3 hours for complete feature implementation
