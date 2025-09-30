import { test, expect } from '@playwright/test';
import { TestDatabase } from '../fixtures/test-database';
import { signIn } from '../fixtures/authHelpers';

// Skip database operations for auth tests - we'll just mock what we need
// Setup for each test
test.beforeEach(async ({ page }) => {
  await TestDatabase.connect();
  await TestDatabase.cleanDatabase();
  page.on('console', (msg) => {
    // Filter out messages if needed
    if (msg.type() === 'log') {
      console.log(`Browser console log: ${msg.text()}`);
    }
  });
});
test.afterEach(async () => {
  await TestDatabase.cleanDatabase();
  await TestDatabase.disconnect();
});

test.describe('Admin Page', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    // Go to the admin page without authentication
    await page.goto('/admin');

    // Check that we see the login page
    await expect(page.locator('h1')).toContainText(
      'Sign in to access the Admin Dashboard'
    );
    await expect(
      page.getByRole('button', { name: 'Sign in with Google' })
    ).toBeVisible();
  });

  test('shows admin dashboard when authenticated as admin', async ({
    page,
  }) => {
    // Go to the admin page
    await page.goto('/admin');

    await signIn(page, process.env.ADMIN_EMAIL, true);

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

    await signIn(page, 'non-admin@example.com', false);
    // Check that we see the not authorized page
    await expect(page.locator('h1')).toContainText('Not Authorized');
    await expect(
      page.getByText('You do not have permission to access this page')
    ).toBeVisible();
  });

  test('updates website name successfully', async ({ page }) => {
    await signIn(page, process.env.ADMIN_EMAIL, true);

    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings/name') &&
        response.status() === 200
    );
    // Update the website name
    const websiteNameInput = page.locator('#name');
    await expect(websiteNameInput).toHaveValue('Shower');
    await websiteNameInput.waitFor({ state: 'visible', timeout: 5000 });
    await websiteNameInput.clear();
    await websiteNameInput.fill('Updated Website Name');

    await expect(async () => {
      const value = await websiteNameInput.inputValue();
      expect(value).toBe('Updated Website Name');
    }).toPass();
    await page.getByRole('button', { name: 'Update Website Name' }).click();

    // Check for success message
    await expect(
      page.getByText('Website name updated successfully')
    ).toBeVisible();

    // Verify that the input field has been updated
    await expect(page.getByLabel('Website Name')).toHaveValue(
      'Updated Website Name'
    );

    await page.reload();
    await expect(page.getByLabel('Website Name')).toHaveValue(
      'Updated Website Name'
    );
  });

  test('validates input field requirements', async ({ page }) => {
    // Go to the admin page
    await page.goto('/admin');

    await signIn(page, process.env.ADMIN_EMAIL, true);

    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings/name') &&
        response.status() === 200
    );

    // Try to submit with empty name
    const websiteNameInput = page.getByLabel('Website Name');
    await websiteNameInput.clear({ timeout: 5000 });
    await websiteNameInput.fill('', { timeout: 5000 });
    await page.getByRole('button', { name: 'Update Website Name' }).click();

    // Check if HTML validation prevents submission (the button remains enabled)
    await expect(
      page.getByRole('button', { name: 'Update Website Name' })
    ).toBeEnabled();

    // Try with a name that's too long (51 characters)
    await websiteNameInput.clear({ timeout: 5000 });
    await websiteNameInput.fill('a'.repeat(51), { timeout: 5000 });

    // Check that the input only accepts 50 characters (due to maxLength)
    await expect(page.getByLabel('Website Name')).toHaveValue('a'.repeat(50));
  });

  test('handles server errors gracefully', async ({ page }) => {
    // Go to the admin page
    await page.goto('/admin');

    await signIn(page, process.env.ADMIN_EMAIL, true);
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
    await page.getByRole('button', { name: 'Update Website Name' }).click();

    // Check for error message
    await expect(page.getByText('Server error')).toBeVisible();
  });
});
