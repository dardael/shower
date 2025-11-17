# Quickstart Guide: Toast Notifications Implementation

## Overview

This guide walks through implementing toast notifications for website settings forms, replacing inline messages with consistent Chakra UI v3 toast notifications that match the existing social networks behavior.

## Prerequisites

- Access to the codebase on branch `001-toast-notifications`
- Understanding of Chakra UI v3 toast system
- Familiarity with existing social networks toast implementation

## Implementation Steps

### Step 1: Create Reusable Toast Hook

**File**: `src/presentation/admin/hooks/useToastNotifications.ts`

```typescript
import { useRef, useCallback } from 'react';
import { toaster } from '@/presentation/shared/components/ui/toaster';

export const useToastNotifications = () => {
  const toastMessagesRef = useRef<Set<string>>(new Set());
  const toastTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const showToast = useCallback(
    (message: string, type: 'success' | 'error') => {
      // Prevent duplicate messages
      if (toastMessagesRef.current.has(message)) {
        return;
      }

      // Create toast
      toaster.create({
        title: type === 'success' ? 'Success' : 'Error',
        description: message,
        type,
        duration: 3000,
      });

      // Track message
      toastMessagesRef.current.add(message);

      // Cleanup after duration
      const timeout = setTimeout(() => {
        toastMessagesRef.current.delete(message);
        toastTimeoutsRef.current.delete(message);
      }, 3000);

      toastTimeoutsRef.current.set(message, timeout);
    },
    []
  );

  const clearAllToasts = useCallback(() => {
    // Clear all timeouts
    toastTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    toastTimeoutsRef.current.clear();
    toastMessagesRef.current.clear();
  }, []);

  return { showToast, clearAllToasts };
};
```

### Step 2: Update WebsiteSettingsForm Component

**File**: `src/presentation/admin/components/WebsiteSettingsForm.tsx`

**Key Changes**:

1. Remove `message` state and inline Text component
2. Import and use `useToastNotifications` hook
3. Replace inline message handling with toast notifications

```typescript
// Add import
import { useToastNotifications } from '@/presentation/admin/hooks/useToastNotifications';

// In component:
const { showToast } = useToastNotifications();

// Remove message state:
// const [message, setMessage] = useState<string>('');

// Update save handlers:
const handleSaveName = async (name: string) => {
  try {
    // ... existing save logic
    showToast('Website name updated successfully', 'success');
  } catch (error) {
    showToast('Failed to update website name', 'error');
  }
};

const handleSaveThemeColor = async (themeColor: string) => {
  try {
    // ... existing save logic
    showToast('Theme color updated successfully', 'success');
  } catch (error) {
    showToast('Invalid theme color provided', 'error');
  }
};

// Remove inline message rendering (lines 310-329)
```

### Step 3: Add Unit Tests

**File**: `test/unit/presentation/admin/hooks/useToastNotifications.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react';
import { useToastNotifications } from '@/presentation/admin/hooks/useToastNotifications';
import { toaster } from '@/presentation/shared/components/ui/toaster';

// Mock toaster
jest.mock('@/presentation/shared/components/ui/toaster');

describe('useToastNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show success toast', () => {
    const { result } = renderHook(() => useToastNotifications());

    act(() => {
      result.current.showToast('Test success', 'success');
    });

    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Success',
      description: 'Test success',
      type: 'success',
      duration: 3000,
    });
  });

  it('should prevent duplicate messages', () => {
    const { result } = renderHook(() => useToastNotifications());

    act(() => {
      result.current.showToast('Duplicate message', 'success');
      result.current.showToast('Duplicate message', 'success');
    });

    expect(toaster.create).toHaveBeenCalledTimes(1);
  });

  it('should cleanup after duration', () => {
    const { result } = renderHook(() => useToastNotifications());

    act(() => {
      result.current.showToast('Test message', 'success');
    });

    expect(toaster.create).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Should allow same message again after cleanup
    act(() => {
      result.current.showToast('Test message', 'success');
    });

    expect(toaster.create).toHaveBeenCalledTimes(2);
  });
});
```

### Step 4: Add E2E Tests

**File**: `test/e2e/admin/website-settings-toast.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Website Settings Toast Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/website-settings');
    // Login if needed
  });

  test('should show success toast for website name save', async ({ page }) => {
    await page.fill('[data-testid="website-name-input"]', 'Test Website');
    await page.click('[data-testid="save-name-button"]');

    // Check for toast
    await expect(page.locator('[data-testid="toast"]')).toBeVisible();
    await expect(page.locator('[data-testid="toast-title"]')).toHaveText(
      'Success'
    );
    await expect(page.locator('[data-testid="toast-description"]')).toHaveText(
      'Website name updated successfully'
    );
  });

  test('should auto-dismiss toast after 3 seconds', async ({ page }) => {
    await page.fill('[data-testid="website-name-input"]', 'Test Website');
    await page.click('[data-testid="save-name-button"]');

    // Toast should be visible
    await expect(page.locator('[data-testid="toast"]')).toBeVisible();

    // Wait for auto-dismiss
    await page.waitForTimeout(3500);

    // Toast should be gone
    await expect(page.locator('[data-testid="toast"]')).not.toBeVisible();
  });

  test('should prevent duplicate toasts for rapid saves', async ({ page }) => {
    await page.fill('[data-testid="website-name-input"]', 'Test Website');

    // Rapid clicks
    await page.click('[data-testid="save-name-button"]');
    await page.click('[data-testid="save-name-button"]');

    // Should only show one toast
    const toasts = page.locator('[data-testid="toast"]');
    await expect(toasts).toHaveCount(1);
  });
});
```

### Step 5: Update Test Dependencies

**File**: `test/e2e/fixtures/test-dependencies.ts`

Add the new test file to the dependency registry:

```typescript
export const TEST_DEPENDENCIES = {
  // ... existing entries
  'test/e2e/admin/website-settings-toast.spec.ts': ['websitesettings'],
};
```

### Step 6: Update Playwright Configuration

**File**: `playwright.config.ts`

Add the new test file to the appropriate project:

```typescript
export default defineConfig({
  projects: [
    // ... existing projects
    {
      name: 'website-settings',
      testMatch: 'test/e2e/admin/website-settings-toast.spec.ts',
      dependencies: ['websitesettings'],
    },
  ],
});
```

## Verification Steps

### Manual Testing

1. Navigate to `/admin/website-settings`
2. Test website name save - should show success toast
3. Test theme color save - should show success toast
4. Test error scenarios - should show error toast
5. Test rapid saves - should prevent duplicates
6. Verify auto-dismiss after 3 seconds

### Automated Testing

```bash
# Run unit tests
docker compose run --rm app npm run test -- test/unit/presentation/admin/hooks/useToastNotifications.test.ts

# Run e2e tests
docker compose up mongodb -d
docker compose run --rm app npm run build
docker compose run --rm -T app npm run test:e2e
```

## Success Criteria

- ✅ All inline messages replaced with toast notifications
- ✅ Toast behavior matches social networks implementation
- ✅ Deduplication prevents duplicate messages
- ✅ Auto-dismiss works correctly after 3 seconds
- ✅ All tests pass (unit + e2e)
- ✅ No console errors or warnings

## Troubleshooting

### Common Issues

- **Toast not appearing**: Check that `<Toaster />` is rendered in admin layout
- **Duplicate toasts**: Verify deduplication logic is properly implemented
- **Memory leaks**: Ensure cleanup functions are called on component unmount
- **Test failures**: Check mock implementations and test data-testid attributes

### Debug Tips

- Use browser dev tools to inspect toast elements
- Check console for any JavaScript errors
- Verify API responses are correctly formatted
- Test with different network conditions
