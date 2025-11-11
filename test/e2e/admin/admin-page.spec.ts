import { test, expect } from '@playwright/test';
import { TestDatabase } from '../fixtures/test-database';
import { signIn } from '../fixtures/authHelpers';
import { TIMEOUTS, RETRY_CONFIG } from '../constants/timeouts';

test.describe('Admin Page', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    // Go to admin page without authentication
    await page.goto('/admin');

    // Check that we see the login page
    await expect(page.locator('h1')).toContainText('Connexion');
    await expect(
      page.getByRole('button', { name: 'Continue with Google' })
    ).toBeVisible();
  });

  test('shows admin dashboard when authenticated as admin', async ({
    page,
  }) => {
    // Go to admin page
    await page.goto('/admin');

    await signIn(page);

    // Should redirect to website-settings
    await page.waitForURL('**/admin/website-settings');

    // Check that we see admin panel with sidebar
    await expect(
      page.getByTestId('desktop-sidebar').getByText('Admin Panel')
    ).toBeVisible();
    await expect(page.getByTestId('menu-item-website-settings')).toBeVisible();
    await expect(page.getByTestId('menu-item-social-networks')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();

    // Check that website settings form is displayed with seeded name
    await expect(page.getByLabel('Website Name')).toHaveValue('Shower');
  });

  test('shows not authorized when authenticated as non-admin', async ({
    page,
  }) => {
    // Go to admin page
    await page.goto('/admin');

    await signIn(page, false);
    // Check that we see not authorized page
    await expect(page.locator('h1')).toContainText('Access Restricted');
    await expect(
      page.getByText(
        "You don't have the necessary permissions to access this admin area"
      )
    ).toBeVisible();
  });

  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async () => {
    // Ensure clean database state for each test in this group
    await TestDatabase.connect();
    await TestDatabase.cleanDatabase();
    // Add a small delay to ensure database operations complete
    await new Promise((resolve) => setTimeout(resolve, TIMEOUTS.QUICK));
    // Double-check that database is actually clean
    await TestDatabase.cleanDatabase();
  });

  test.afterEach(async () => {
    // Cleanup after each test
    await TestDatabase.cleanDatabase();
    await TestDatabase.disconnect();
  });

  test('updates website name successfully', async ({ page }) => {
    await signIn(page);

    // Navigate to website settings page to ensure fresh state
    await page.goto('/admin/website-settings');
    await page.waitForLoadState('networkidle');

    // Wait for page to load and data to be fetched
    const websiteNameInput = page.getByLabel('Website Name');
    await websiteNameInput.waitFor({
      state: 'visible',
      timeout: TIMEOUTS.LONG,
    });
    await expect(websiteNameInput).toHaveValue('Shower', {
      timeout: TIMEOUTS.MEDIUM,
    });

    // Update website name
    await websiteNameInput.clear();
    await websiteNameInput.fill('Updated Website Name');
    await expect(websiteNameInput).toHaveValue('Updated Website Name');

    // Click update button and wait for success
    await page.getByRole('button', { name: 'Update Website' }).click();

    // Check for success message first
    await expect(
      page.getByText('Website settings updated successfully')
    ).toBeVisible({ timeout: TIMEOUTS.MEDIUM });

    // Wait for automatic refetch to complete and update input
    // The component calls fetchWebsiteSettings() after successful update
    await expect(websiteNameInput).toHaveValue('Updated Website Name', {
      timeout: TIMEOUTS.LONG,
    });

    // Reload and verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait for input to be visible and populated after reload
    await websiteNameInput.waitFor({
      state: 'visible',
      timeout: TIMEOUTS.LONG,
    });

    // Wait for data to be loaded by checking for the expected value
    // Add retry logic for potential race conditions
    let retries = 0;
    while (retries < RETRY_CONFIG.MAX_RETRIES) {
      try {
        await expect(websiteNameInput).toHaveValue('Updated Website Name', {
          timeout: TIMEOUTS.MEDIUM,
        });
        break; // Success, exit retry loop
      } catch (error) {
        retries++;
        if (retries >= RETRY_CONFIG.MAX_RETRIES) {
          throw error; // Re-throw if max retries reached
        }
        // Wait a bit before retry
        await page.waitForTimeout(RETRY_CONFIG.RETRY_DELAY);
      }
    }
  });

  test('validates input field requirements', async ({ page }) => {
    await signIn(page);

    // Wait for settings to be loaded
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings') && response.status() === 200
    );

    // Try to submit with empty name
    const websiteNameInput = page.getByLabel('Website Name');
    await websiteNameInput.clear({ timeout: TIMEOUTS.MEDIUM });
    await websiteNameInput.fill('', { timeout: TIMEOUTS.MEDIUM });
    await page.getByRole('button', { name: 'Update Website' }).click();

    // Check if HTML validation prevents submission (the button remains enabled)
    await expect(
      page.getByRole('button', { name: 'Update Website' })
    ).toBeEnabled();

    // Try with a name that's too long (51 characters)
    await websiteNameInput.clear({ timeout: TIMEOUTS.MEDIUM });
    await websiteNameInput.fill('a'.repeat(51), { timeout: TIMEOUTS.MEDIUM });

    // Check that input only accepts 50 characters (due to maxLength)
    await expect(page.getByLabel('Website Name')).toHaveValue('a'.repeat(50));
  });

  test('handles server errors gracefully', async ({ page }) => {
    await signIn(page);
    // Intercept the API call and mock a server error
    await page.route('/api/settings', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    // Update website name
    const websiteNameInput = page.getByLabel('Website Name');
    await websiteNameInput.clear({ timeout: TIMEOUTS.MEDIUM });
    await websiteNameInput.fill('This will fail', { timeout: TIMEOUTS.MEDIUM });
    await page.getByRole('button', { name: 'Update Website' }).click();

    // Check for error message
    await expect(page.getByText('Server error')).toBeVisible();
  });
});
