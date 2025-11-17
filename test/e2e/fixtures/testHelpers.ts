import { Page } from '@playwright/test';

/**
 * Test utility functions for common test operations
 */

/**
 * Clears all toast notifications from the page
 * @param page - Playwright page instance
 */
export async function clearToasts(page: Page): Promise<void> {
  // Wait for any existing toasts to be removable
  await page.waitForTimeout(100);

  // Try to close all visible toasts
  const toastCloseButtons = page
    .getByTestId('toast')
    .getByRole('button', { name: /close/i });
  const count = await toastCloseButtons.count();

  for (let i = 0; i < count; i++) {
    try {
      await toastCloseButtons.nth(i).click({ timeout: 1000 });
    } catch {
      // Ignore if toast is no longer clickable
    }
  }

  // Wait for toasts to be removed from DOM
  await page.waitForTimeout(200);

  // Alternative: use JavaScript to remove all toasts
  await page.evaluate(() => {
    const toasts = document.querySelectorAll('[data-testid="toast"]');
    toasts.forEach((toast) => toast.remove());
  });
}

/**
 * Wait for and clear any existing toasts before test actions
 * @param page - Playwright page instance
 */
export async function ensureCleanToastState(page: Page): Promise<void> {
  // First clear any existing toasts
  await clearToasts(page);

  // Wait a bit more to ensure DOM is stable
  await page.waitForTimeout(100);
}

/**
 * Reset website settings to default state for test isolation
 * @param page - Playwright page instance
 */
export async function resetWebsiteSettings(page: Page): Promise<void> {
  try {
    // First try API reset
    const response = await page.request.post('/api/settings', {
      data: { name: 'Shower' },
    });

    if (!response.ok()) {
      // If API fails, try direct database cleanup
      const { TestDatabase } = await import('./test-database');
      await TestDatabase.connect();
      await TestDatabase.cleanCollection('websiteSettings');
      await TestDatabase.disconnect();
    }
  } catch {
    // If everything fails, try database cleanup as last resort
    try {
      const { TestDatabase } = await import('./test-database');
      await TestDatabase.connect();
      await TestDatabase.cleanCollection('websiteSettings');
      await TestDatabase.disconnect();
    } catch {
      // Continue with test even if cleanup fails
    }
  }

  // Always clear browser storage
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch {
      // localStorage might not be available
    }
    try {
      sessionStorage.clear();
    } catch {
      // sessionStorage might not be available
    }
  });
}
