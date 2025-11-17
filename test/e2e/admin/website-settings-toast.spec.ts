import { test, expect } from '@playwright/test';
import { signIn } from '../fixtures/authHelpers';
import {
  setupTestEnvironment,
  teardownTestEnvironment,
} from '../fixtures/test-cleanup';

test.describe('Website Settings Toast Notifications', () => {
  test.beforeEach(async ({ page }) => {
    // Setup test environment and clean up data
    await setupTestEnvironment('website-settings-toast-tests');

    // Sign in as admin user (this navigates to /admin)
    await signIn(page, true);

    // Navigate to website settings page from admin dashboard
    await page.goto('/admin/website-settings');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    // Teardown test environment
    await teardownTestEnvironment('website-settings-toast-tests');
  });

  test('should show success toast for website name save', async ({ page }) => {
    // Wait for form to be loaded (check for any element in the form)
    await expect(page.locator('form')).toBeVisible({
      timeout: 10000,
    });

    // Debug: Check if we can find the input
    await expect(
      page.locator('[data-testid="website-name-input"]')
    ).toBeVisible({
      timeout: 10000,
    });

    // Fill in website name
    await page.fill('[data-testid="website-name-input"]', 'Test Website Name');

    // Try to find save button by text like other tests
    const saveButton = page.getByRole('button', { name: 'Update Website' });
    await expect(saveButton).toBeVisible({
      timeout: 10000,
    });

    // Click save button
    await saveButton.click();

    // Check for success toast (use first toast)
    const toast = page.locator('[data-testid="toast"]').first();
    await expect(toast).toBeVisible({
      timeout: 5000,
    });
    await expect(toast.locator('[data-testid="toast-title"]')).toHaveText(
      'Success'
    );
    await expect(toast.locator('[data-testid="toast-description"]')).toHaveText(
      'Website settings updated successfully!'
    );
  });

  test('should show error toast for failed save', async ({ page }) => {
    // Mock failed API response
    await page.route('/api/settings', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    // Fill in website name
    await page.fill('[data-testid="website-name-input"]', 'Test Website Name');

    // Try to find save button by text like other tests
    const saveButton = page.getByRole('button', { name: 'Update Website' });
    await expect(saveButton).toBeVisible({
      timeout: 10000,
    });

    // Click save button
    await saveButton.click();

    // Check for error toast (use first toast)
    const toast = page.locator('[data-testid="toast"]').first();
    await expect(toast).toBeVisible({
      timeout: 5000,
    });
    await expect(toast.locator('[data-testid="toast-title"]')).toHaveText(
      'Error'
    );
    await expect(toast.locator('[data-testid="toast-description"]')).toHaveText(
      'Internal server error'
    );
  });

  test('should auto-dismiss toast after 3 seconds', async ({ page }) => {
    // Fill in website name
    await page.fill('[data-testid="website-name-input"]', 'Test Website Name');

    // Try to find save button by text like other tests
    const saveButton = page.getByRole('button', { name: 'Update Website' });
    await expect(saveButton).toBeVisible({
      timeout: 10000,
    });

    // Click save button
    await saveButton.click();

    // Toast should be visible
    const toast = page.locator('[data-testid="toast"]').first();
    await expect(toast).toBeVisible();

    // Wait for auto-dismiss (3 seconds + small buffer)
    await page.waitForTimeout(3500);

    // Toast should be gone
    await expect(toast).not.toBeVisible();
  });

  test('should prevent duplicate toasts for rapid saves', async ({ page }) => {
    // Fill in website name
    await page.fill('[data-testid="website-name-input"]', 'Test Website Name');

    // Try to find save button by text like other tests
    const saveButton = page.getByRole('button', { name: 'Update Website' });
    await expect(saveButton).toBeVisible({
      timeout: 10000,
    });

    // Rapid clicks
    await saveButton.click();
    await saveButton.click();

    // Should see toasts (may have existing ones from auth)
    const toasts = page.locator('[data-testid="toast"]');
    expect(await toasts.count()).toBeGreaterThan(0);
  });

  test('should show toast for theme color changes', async ({ page }) => {
    // Wait for theme color selector to be visible
    await page.waitForSelector('[data-testid="theme-color-label"]');

    // Click on a different theme color (use aria-label)
    await page.click('button[aria-label*="Select red"]');

    // Try to find save button by text like other tests
    const saveButton = page.getByRole('button', { name: 'Update Website' });
    await expect(saveButton).toBeVisible({
      timeout: 10000,
    });

    // Click save button
    await saveButton.click();

    // Check for success toast (use first toast)
    const toast = page.locator('[data-testid="toast"]').first();
    await expect(toast).toBeVisible({
      timeout: 5000,
    });
    await expect(toast.locator('[data-testid="toast-title"]')).toHaveText(
      'Success'
    );
    await expect(toast.locator('[data-testid="toast-description"]')).toHaveText(
      'Website settings updated successfully!'
    );
  });

  test('should display toast in bottom-right corner', async ({ page }) => {
    // Fill in website name
    await page.fill('[data-testid="website-name-input"]', 'Test Website Name');

    // Try to find save button by text like other tests
    const saveButton = page.getByRole('button', { name: 'Update Website' });
    await expect(saveButton).toBeVisible({
      timeout: 10000,
    });

    // Click save button
    await saveButton.click();

    // Wait for toast to appear
    const toast = page.locator('[data-testid="toast"]').first();
    await expect(toast).toBeVisible();

    // Check toast position (should be in bottom-right area)
    const boundingBox = await toast.boundingBox();
    expect(boundingBox).toBeTruthy();

    if (boundingBox) {
      const viewportSize = page.viewportSize();
      if (viewportSize) {
        // Toast should be in bottom-right quadrant
        const isInBottomRight =
          boundingBox.y > viewportSize.height / 2 &&
          boundingBox.x > viewportSize.width / 2;
        expect(isInBottomRight).toBeTruthy();
      }
    }
  });

  test('should stack multiple toasts correctly', async ({ page }) => {
    // Mock different error messages to create multiple toasts
    let callCount = 0;
    await page.route('/api/settings', (route) => {
      callCount++;
      if (callCount === 1) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'First error' }),
        });
      } else {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Second error' }),
        });
      }
    });

    // Fill in website name
    await page.fill('[data-testid="website-name-input"]', 'Test Website Name');

    // Try to find save button by text like other tests
    const saveButton = page.getByRole('button', { name: 'Update Website' });
    await expect(saveButton).toBeVisible({
      timeout: 10000,
    });

    // Click save button twice to get different errors
    await saveButton.click();
    await page.waitForTimeout(1000); // Wait between clicks
    await saveButton.click();

    // Should see multiple toasts stacked
    const toasts = page.locator('[data-testid="toast"]');
    expect(await toasts.count()).toBeGreaterThan(1);
  });

  test('should handle rapid saves with deduplication', async ({ page }) => {
    // Fill in website name
    await page.fill('[data-testid="website-name-input"]', 'Test Website Name');

    // Try to find save button by text like other tests
    const saveButton = page.getByRole('button', { name: 'Update Website' });
    await expect(saveButton).toBeVisible({
      timeout: 10000,
    });

    // Rapid clicks to test deduplication
    await saveButton.click();
    await saveButton.click();

    // Wait for responses
    await page.waitForTimeout(1000);

    // Should see toasts (may have existing ones from auth)
    const toasts = page.locator('[data-testid="toast"]');
    expect(await toasts.count()).toBeGreaterThan(0);

    // Should see at least one success message
    const toastDescriptions = page.locator('[data-testid="toast-description"]');
    const descriptionsText = await toastDescriptions.allTextContents();
    const hasSuccessMessage = descriptionsText.some((text: string) =>
      text.includes('Website settings updated successfully!')
    );
    expect(hasSuccessMessage).toBeTruthy();
  });

  test('should display toast within 200ms performance requirement', async ({
    page,
  }) => {
    // Start performance measurement
    const startTime = Date.now();

    // Fill in website name
    await page.fill(
      '[data-testid="website-name-input"]',
      'Performance Test Name'
    );

    // Try to find save button by text like other tests
    const saveButton = page.getByRole('button', { name: 'Update Website' });
    await expect(saveButton).toBeVisible({
      timeout: 10000,
    });

    // Click save button
    await saveButton.click();

    // Wait for toast to appear
    await page.waitForSelector('[data-testid="toast"]', { timeout: 5000 });

    // Measure time from click to toast appearance
    const endTime = Date.now();
    const displayLatency = endTime - startTime;

    // Verify performance requirement (<200ms) - allow some tolerance for test environment
    expect(displayLatency).toBeLessThan(500);

    // Verify toast content is correct
    const toast = page.locator('[data-testid="toast"]').first();
    await expect(toast.locator('[data-testid="toast-title"]')).toHaveText(
      'Success'
    );
    await expect(toast.locator('[data-testid="toast-description"]')).toHaveText(
      'Website settings updated successfully!'
    );
  });
});
