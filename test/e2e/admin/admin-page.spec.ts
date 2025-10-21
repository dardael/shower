import { test, expect } from '@playwright/test';
import { TestDatabase } from '../fixtures/test-database';
import { signIn } from '../fixtures/authHelpers';

test.describe('Admin Page', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    // Go to the admin page without authentication
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
    // Go to the admin page
    await page.goto('/admin');

    await signIn(page);

    // Check that we see the admin dashboard
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
    await expect(page.locator('form')).toBeVisible();

    // Check that the website settings form is displayed with the seeded name
    await expect(page.getByLabel('Website Name')).toHaveValue('Shower');
  });

  test('shows not authorized when authenticated as non-admin', async ({
    page,
  }) => {
    // Go to the admin page
    await page.goto('/admin');

    await signIn(page, false);
    // Check that we see the not authorized page
    await expect(page.locator('h1')).toContainText('Access Restricted');
    await expect(
      page.getByText(
        "You don't have the necessary permissions to access this admin area"
      )
    ).toBeVisible();
  });

  test.describe.configure({ mode: 'serial' });

  test('updates website name successfully', async ({ page }) => {
    // Setup for this test
    await TestDatabase.connect();
    await TestDatabase.cleanDatabase();

    await signIn(page);

    // Wait for page to load and data to be fetched
    const websiteNameInput = page.getByLabel('Website Name');
    await websiteNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await expect(websiteNameInput).toHaveValue('Shower', { timeout: 5000 });

    // Update the website name
    await websiteNameInput.clear();
    await websiteNameInput.fill('Updated Website Name');
    await expect(websiteNameInput).toHaveValue('Updated Website Name');

    // Wait for the update API call to complete
    const updateResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings') && response.status() === 200
    );

    await page.getByRole('button', { name: 'Update Website' }).click();
    await updateResponse;

    // Check for success message
    await expect(
      page.getByText('Website name updated successfully')
    ).toBeVisible({ timeout: 5000 });

    // Verify that the input field has been updated
    await expect(websiteNameInput).toHaveValue('Updated Website Name');

    // Reload and verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait for the input to be visible and populated after reload
    await websiteNameInput.waitFor({ state: 'visible', timeout: 10000 });

    // Wait for the data to be loaded by checking for the expected value
    await expect(websiteNameInput).toHaveValue('Updated Website Name', {
      timeout: 10000,
    });

    // Cleanup
    await TestDatabase.cleanDatabase();
    await TestDatabase.disconnect();
  });

  test('validates input field requirements', async ({ page }) => {
    // Setup for this test
    await TestDatabase.connect();
    await TestDatabase.cleanDatabase();

    try {
      await signIn(page);

      await page.waitForResponse(
        (response) =>
          response.url().includes('/api/settings/name') &&
          response.status() === 200
      );

      // Try to submit with empty name
      const websiteNameInput = page.getByLabel('Website Name');
      await websiteNameInput.clear({ timeout: 5000 });
      await websiteNameInput.fill('', { timeout: 5000 });
      await page.getByRole('button', { name: 'Update Website' }).click();

      // Check if HTML validation prevents submission (the button remains enabled)
      await expect(
        page.getByRole('button', { name: 'Update Website' })
      ).toBeEnabled();

      // Try with a name that's too long (51 characters)
      await websiteNameInput.clear({ timeout: 5000 });
      await websiteNameInput.fill('a'.repeat(51), { timeout: 5000 });

      // Check that the input only accepts 50 characters (due to maxLength)
      await expect(page.getByLabel('Website Name')).toHaveValue('a'.repeat(50));
    } finally {
      // Cleanup
      await TestDatabase.cleanDatabase();
      await TestDatabase.disconnect();
    }
  });

  test('handles server errors gracefully', async ({ page }) => {
    // Setup for this test
    await TestDatabase.connect();
    await TestDatabase.cleanDatabase();

    try {
      await signIn(page);
      // Intercept the API call and mock a server error
      await page.route('/api/settings', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' }),
        });
      });

      // Update the website name
      const websiteNameInput = page.getByLabel('Website Name');
      await websiteNameInput.clear({ timeout: 5000 });
      await websiteNameInput.fill('This will fail', { timeout: 5000 });
      await page.getByRole('button', { name: 'Update Website' }).click();

      // Check for error message
      await expect(page.getByText('Server error')).toBeVisible();
    } finally {
      // Cleanup
      await TestDatabase.cleanDatabase();
      await TestDatabase.disconnect();
    }
  });
});
